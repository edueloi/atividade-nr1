import { Router } from "express";
import db from "../db/database.js";

const router = Router();

// API Routes
router.get("/tenants", (req, res) => {
  const tenants = db.prepare("SELECT * FROM tenants").all();
  res.json(tenants);
});

router.get("/units/:tenantId", (req, res) => {
  const units = db.prepare("SELECT * FROM units WHERE tenant_id = ?").all(req.params.tenantId);
  res.json(units);
});

router.get("/sectors", (req, res) => {
  const { unitId } = req.query;

  if (!unitId) {
    res.json([]);
    return;
  }

  const sectors = db.prepare("SELECT * FROM sectors WHERE unit_id = ? ORDER BY name").all(unitId);
  res.json(sectors);
});

router.get("/dashboard/stats/:tenantId", (req, res) => {
  const { tenantId } = req.params;
  
  const momentary = db.prepare("SELECT count(*) as count FROM complaints WHERE tenant_id = ? AND type = 'MOMENTARY'").get(tenantId) as any;
  const ambulatory = db.prepare("SELECT count(*) as count FROM complaints WHERE tenant_id = ? AND type = 'AMBULATORY'").get(tenantId) as any;
  const recurrent = db.prepare("SELECT count(*) as count FROM complaints WHERE tenant_id = ? AND is_recurrent = 1").get(tenantId) as any;
  const resolved = db.prepare("SELECT count(*) as count FROM complaints WHERE tenant_id = ? AND status = 'RESOLVED'").get(tenantId) as any;

  const stats = {
    participation: 84.2,
    complaints_momentary: momentary.count,
    complaints_ambulatory: ambulatory.count,
    complaints_recurrent: recurrent.count,
    complaints_resolved: resolved.count,
    absenteismo: 4.5,
    rehabilitated: 76
  };
  res.json(stats);
});

// --- Funil Clínico (Queixas) ---
router.post("/complaints", (req, res) => {
  const { id, tenant_id, unit_id, sector_id, shift_id, type, body_part, severity, description, initial_action_json, created_by } = req.body;
  
  db.transaction(() => {
    db.prepare(`
      INSERT INTO complaints (id, tenant_id, unit_id, sector_id, shift_id, type, body_part, severity, description, initial_action_json, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, tenant_id, unit_id, sector_id, shift_id, type, body_part, severity, description, JSON.stringify(initial_action_json || []), created_by);
    
    // Initial timeline entry
    const timelineId = `tl-${Date.now()}`;
    db.prepare(`
      INSERT INTO complaint_timeline (id, complaint_id, action_type, note, to_status, created_by)
      VALUES (?, ?, 'CREATE', 'Queixa registrada', 'OPEN', ?)
    `).run(timelineId, id, created_by);
  })();
  
  res.json({ success: true });
});

router.get("/complaints", (req, res) => {
  const { tenantId, from, to, unitId, sectorId, type, status, severity, bodyPart } = req.query;
  let query = `
    SELECT c.*, u.name as unit_name, s.name as sector_name, usr.name as creator_name
    FROM complaints c
    JOIN units u ON c.unit_id = u.id
    JOIN sectors s ON c.sector_id = s.id
    JOIN users usr ON c.created_by = usr.id
    WHERE c.tenant_id = ?
  `;
  const params: any[] = [tenantId];

  if (from && to) {
    query += " AND c.created_at BETWEEN ? AND ?";
    params.push(from, to);
  }
  if (unitId) {
    query += " AND c.unit_id = ?";
    params.push(unitId);
  }
  if (sectorId) {
    query += " AND c.sector_id = ?";
    params.push(sectorId);
  }
  if (type) {
    query += " AND c.type = ?";
    params.push(type);
  }
  if (status) {
    query += " AND c.status = ?";
    params.push(status);
  }
  if (severity) {
    query += " AND c.severity = ?";
    params.push(severity);
  }
  if (bodyPart) {
    query += " AND c.body_part = ?";
    params.push(bodyPart);
  }

  query += " ORDER BY c.created_at DESC";
  const records = db.prepare(query).all(...params);
  res.json(records.map((r: any) => ({ ...r, initial_action_json: JSON.parse(r.initial_action_json || '[]') })));
});

router.get("/complaints/:id", (req, res) => {
  const record = db.prepare(`
    SELECT c.*, u.name as unit_name, s.name as sector_name, usr.name as creator_name
    FROM complaints c
    JOIN units u ON c.unit_id = u.id
    JOIN sectors s ON c.sector_id = s.id
    JOIN users usr ON c.created_by = usr.id
    WHERE c.id = ?
  `).get(req.params.id) as any;
  
  if (record) {
    record.initial_action_json = JSON.parse(record.initial_action_json || '[]');
  }
  res.json(record);
});

router.put("/complaints/:id", (req, res) => {
  const { id } = req.params;
  const { unit_id, sector_id, shift_id, type, body_part, severity, description, initial_action_json, updated_by } = req.body;
  
  db.prepare(`
    UPDATE complaints 
    SET unit_id = ?, sector_id = ?, shift_id = ?, type = ?, body_part = ?, severity = ?, description = ?, initial_action_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(unit_id, sector_id, shift_id, type, body_part, severity, description, JSON.stringify(initial_action_json || []), id);
  
  res.json({ success: true });
});

router.patch("/complaints/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, note, updated_by } = req.body;
  
  const before = db.prepare("SELECT status FROM complaints WHERE id = ?").get(id) as any;
  
  db.transaction(() => {
    db.prepare("UPDATE complaints SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
    
    const timelineId = `tl-${Date.now()}`;
    db.prepare(`
      INSERT INTO complaint_timeline (id, complaint_id, action_type, note, from_status, to_status, created_by)
      VALUES (?, ?, 'STATUS_CHANGE', ?, ?, ?, ?)
    `).run(timelineId, id, note || 'Alteração de status', before.status, status, updated_by);
  })();
  
  res.json({ success: true });
});

router.post("/complaints/:id/timeline", (req, res) => {
  const { id: complaintId } = req.params;
  const { action_type, note, created_by } = req.body;
  const id = `tl-${Date.now()}`;
  
  db.prepare(`
    INSERT INTO complaint_timeline (id, complaint_id, action_type, note, created_by)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, complaintId, action_type, note, created_by);
  
  res.json({ success: true, id });
});

router.get("/complaints/:id/timeline", (req, res) => {
  const timeline = db.prepare(`
    SELECT t.*, usr.name as user_name
    FROM complaint_timeline t
    JOIN users usr ON t.created_by = usr.id
    WHERE t.complaint_id = ?
    ORDER BY t.created_at DESC
  `).all(req.params.id);
  res.json(timeline);
});

router.post("/complaints/:id/referrals", (req, res) => {
  const { id: complaintId } = req.params;
  const { target_module, priority, assigned_to, note, created_by } = req.body;
  const id = `ref-${Date.now()}`;
  
  db.transaction(() => {
    db.prepare(`
      INSERT INTO complaint_referrals (id, complaint_id, target_module, priority, assigned_to)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, complaintId, target_module, priority, assigned_to);
    
    const timelineId = `tl-${Date.now()}`;
    db.prepare(`
      INSERT INTO complaint_timeline (id, complaint_id, action_type, note, created_by)
      VALUES (?, ?, 'REFERRAL', ?, ?)
    `).run(timelineId, complaintId, `Encaminhado para ${target_module}: ${note}`, created_by);
    
    // Also update complaint status
    db.prepare("UPDATE complaints SET status = 'REFERRED' WHERE id = ?").run(complaintId);
  })();
  
  res.json({ success: true, id });
});

router.get("/complaints/body-parts/:tenantId", (req, res) => {
  const stats = db.prepare(`
    SELECT body_part, count(*) as value 
    FROM complaints 
    WHERE tenant_id = ?
    GROUP BY body_part
  `).all(req.params.tenantId);
  res.json(stats);
});

// --- Aula + Presença (Gym/Classes) ---
router.get("/classes/today", (req, res) => {
  const { tenantId, userId } = req.query;
  const today = new Date().toISOString().split('T')[0];
  
  const sessions = db.prepare(`
    SELECT 
      cs.*, 
      s.name as sector_name, 
      sh.name as shift_name,
      u.name as unit_name,
      usr.name as instructor_name,
      CASE 
        WHEN sh.name = 'T1' THEN s.expected_count_t1
        WHEN sh.name = 'T2' THEN s.expected_count_t2
        WHEN sh.name = 'T3' THEN s.expected_count_t3
        ELSE 0
      END as expected_count
    FROM class_sessions cs
    JOIN sectors s ON cs.sector_id = s.id
    JOIN shifts sh ON cs.shift_id = sh.id
    JOIN units u ON cs.unit_id = u.id
    JOIN users usr ON cs.instructor_user_id = usr.id
    WHERE cs.tenant_id = ? AND cs.date_time_start LIKE ?
  `).all(tenantId, `${today}%`);
  
  res.json(sessions);
});

router.post("/classes/start", (req, res) => {
  const { sessionId } = req.body;
  db.prepare("UPDATE class_sessions SET status = 'running' WHERE id = ?").run(sessionId);
  res.json({ success: true });
});

router.post("/classes/:classId/attendance", (req, res) => {
  const { classId } = req.params;
  const { expectedCount, presentCount, method } = req.body;
  const id = `att-${Date.now()}`;
  
  db.prepare(`
    INSERT INTO attendance (id, class_session_id, expected_count, present_count, method)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, classId, expectedCount, presentCount, method);
  
  res.json({ success: true, id });
});

router.post("/classes/:classId/finish", (req, res) => {
  const { classId } = req.params;
  const { notes } = req.body;
  const now = new Date().toISOString();
  
  db.prepare(`
    UPDATE class_sessions 
    SET status = 'finished', notes = ?, date_time_end = ? 
    WHERE id = ?
  `).run(notes, now, classId);
  
  res.json({ success: true });
});

router.post("/classes/:classId/evidence", (req, res) => {
  const { classId } = req.params;
  const { tenantId, fileUrl, createdBy, tags } = req.body;
  const id = `evid-${Date.now()}`;
  
  db.prepare(`
    INSERT INTO evidence (id, tenant_id, ref_type, ref_id, file_url, tags, created_by)
    VALUES (?, ?, 'class_session', ?, ?, ?, ?)
  `).run(id, tenantId, classId, fileUrl, JSON.stringify(tags || []), createdBy);
  
  res.json({ success: true, id });
});

router.get("/schedules", (req, res) => {
  const { tenantId } = req.query;
  const schedules = db.prepare(`
    SELECT s.*, sec.name as sector_name, sh.name as shift_name
    FROM schedules s
    JOIN sectors sec ON s.sector_id = sec.id
    JOIN shifts sh ON s.shift_id = sh.id
    WHERE s.tenant_id = ?
  `).all(tenantId);
  res.json(schedules);
});

router.post("/schedules", (req, res) => {
  const { id, tenant_id, unit_id, sector_id, shift_id, day_of_week, start_time, duration_minutes, assigned_user_id, recurrence_rule } = req.body;
  db.prepare(`
    INSERT INTO schedules (id, tenant_id, unit_id, sector_id, shift_id, day_of_week, start_time, duration_minutes, assigned_user_id, recurrence_rule)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, tenant_id, unit_id, sector_id, shift_id, day_of_week, start_time, duration_minutes, assigned_user_id, recurrence_rule);
  res.json({ success: true });
});

router.put("/schedules/:id", (req, res) => {
  const { id } = req.params;
  const { sector_id, shift_id, day_of_week, start_time, duration_minutes, assigned_user_id } = req.body;
  db.prepare(`
    UPDATE schedules 
    SET sector_id = ?, shift_id = ?, day_of_week = ?, start_time = ?, duration_minutes = ?, assigned_user_id = ?
    WHERE id = ?
  `).run(sector_id, shift_id, day_of_week, start_time, duration_minutes, assigned_user_id, id);
  res.json({ success: true });
});

router.delete("/schedules/:id", (req, res) => {
  db.prepare("DELETE FROM schedules WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.get("/reports/attendance/monthly", (req, res) => {
  const { tenantId, month, year } = req.query;
  // Mocking monthly report
  res.json({
    participationBySector: [
      { sector: 'Montagem Cross', rate: 85 },
      { sector: 'Logística', rate: 72 },
      { sector: 'Pintura', rate: 90 },
      { sector: 'Manutenção', rate: 78 },
    ],
    dailyParticipation: [
      { day: '01/03', rate: 82 },
      { day: '02/03', rate: 85 },
      { day: '03/03', rate: 79 },
    ]
  });
});

router.get("/pending/monthly", (req, res) => {
  const { tenantId, month, year } = req.query;
  // Mocking pending classes
  res.json([
    { id: 'p1', sector_name: 'Logística', shift_name: 'T1', date: '2026-03-01', reason: 'Sem presença registrada' },
    { id: 'p2', sector_name: 'Pintura', shift_name: 'T2', date: '2026-03-02', reason: 'Aula planejada não realizada' },
  ]);
});

// --- Fechamento (Closing) ---
router.get("/closing/months", (req, res) => {
  const { tenantId } = req.query;
  const closings = db.prepare("SELECT * FROM month_closings WHERE tenant_id = ? ORDER BY year DESC, month DESC").all(tenantId);
  res.json(closings);
});

router.get("/closing/summary/:id", (req, res) => {
  const closing = db.prepare("SELECT * FROM month_closings WHERE id = ?").get(req.params.id) as any;
  if (!closing) return res.status(404).json({ error: "Closing not found" });
  
  // Mocking summary data for the month with the correct structure
  res.json({
    totalIssues: 12,
    criticalIssues: 3,
    importantIssues: 5,
    modulesOk: 4,
    reportsGenerated: 2,
    evidencesCount: 45,
    progressByModule: [
      { module: 'Aula + Presença', total: 20, done: 18, status: 'PENDING' },
      { module: 'Queixas', total: 10, done: 10, status: 'OK' },
      { module: 'Fisioterapia', total: 15, done: 14, status: 'PENDING' },
      { module: 'Absenteísmo', total: 30, done: 25, status: 'CRITICAL' },
      { module: 'Ergonomia', total: 5, done: 5, status: 'OK' },
      { module: 'NR1', total: 8, done: 7, status: 'CRITICAL' },
      { module: 'Campanhas', total: 1, done: 1, status: 'OK' },
      { module: 'Plano de Ação', total: 12, done: 10, status: 'PENDING' },
      { module: 'Evidências', total: 45, done: 45, status: 'OK' }
    ],
    status: closing.status
  });
});

router.get("/closing/issues/:id", (req, res) => {
  // Mocking issues
  res.json([
    { id: 'iss-1', module: 'GYM', severity: 'HIGH', description: '2 aulas sem presença registrada na Unidade Sorocaba', status: 'OPEN' },
    { id: 'iss-2', module: 'ABSENTEEISM', severity: 'MEDIUM', description: '1 atestado pendente de confirmação', status: 'OPEN' },
  ]);
});

router.post("/closing/start-review/:id", (req, res) => {
  db.prepare("UPDATE month_closings SET status = 'REVIEW' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.post("/closing/close/:id", (req, res) => {
  const { userId } = req.body;
  const now = new Date().toISOString();
  db.prepare("UPDATE month_closings SET status = 'CLOSED', closed_at = ?, closed_by = ? WHERE id = ?")
    .run(now, userId, req.params.id);
  res.json({ success: true });
});

router.post("/closing/reopen/:id", (req, res) => {
  const { reason, modules, userId } = req.body;
  db.prepare("UPDATE month_closings SET status = 'OPEN' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.get("/closing/rules", (req, res) => {
  const { tenantId } = req.query;
  const rules = db.prepare("SELECT * FROM closing_rules WHERE tenant_id = ?").all(tenantId);
  res.json(rules.map((r: any) => ({ ...r, is_mandatory: !!r.is_mandatory, is_active: !!r.is_active })));
});

router.patch("/closing/rules/:id", (req, res) => {
  const { is_mandatory, is_active } = req.body;
  db.prepare("UPDATE closing_rules SET is_mandatory = ?, is_active = ? WHERE id = ?")
    .run(is_mandatory ? 1 : 0, is_active ? 1 : 0, req.params.id);
  res.json({ success: true });
});

router.get("/reports/attendance/summary", (req, res) => {
  const { tenantId, year } = req.query;
  res.json({
    participationByMonth: [
      { month: 'Jan', rate: 82 },
      { month: 'Fev', rate: 78 },
      { month: 'Mar', rate: 85 },
    ],
    rankingBelowGoal: [
      { sector: 'Logística', rate: 72 },
      { sector: 'Pintura', rate: 75 },
    ]
  });
});

// --- Absenteísmo (Absenteeism) ---
// Audit Log Helper
function logAudit(tenantId: string, entityType: string, entityId: string, action: string, userId: string, before: any = null, after: any = null) {
  const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  db.prepare(`
    INSERT INTO audit_log (id, tenant_id, entity_type, entity_id, action, before_json, after_json, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, tenantId, entityType, entityId, action, before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null, userId);
}

router.post("/absenteeism", (req, res) => {
  const { id, tenant_id, unit_id, sector_id, shift_id, start_date, end_date, days_lost, range_class, cid_group, cid_code, notes, status, created_by } = req.body;
  db.prepare(`
    INSERT INTO absenteeism_records (id, tenant_id, unit_id, sector_id, shift_id, start_date, end_date, days_lost, range_class, cid_group, cid_code, notes, status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, tenant_id, unit_id, sector_id, shift_id, start_date, end_date, days_lost, range_class, cid_group, cid_code, notes, status, created_by);
  
  logAudit(tenant_id, 'absenteeism', id, 'CREATE', created_by, null, req.body);
  
  res.json({ success: true });
});

router.get("/absenteeism", (req, res) => {
  const { tenantId, month, year, unitId, sectorId, cidGroup, range, status } = req.query;
  let query = `
    SELECT a.*, u.name as unit_name, s.name as sector_name
    FROM absenteeism_records a
    JOIN units u ON a.unit_id = u.id
    JOIN sectors s ON a.sector_id = s.id
    WHERE a.tenant_id = ?
  `;
  const params: any[] = [tenantId];

  if (month && year) {
    query += " AND a.start_date LIKE ?";
    params.push(`${year}-${month.toString().padStart(2, '0')}%`);
  }
  if (unitId) {
    query += " AND a.unit_id = ?";
    params.push(unitId);
  }
  if (sectorId) {
    query += " AND a.sector_id = ?";
    params.push(sectorId);
  }
  if (cidGroup) {
    query += " AND a.cid_group = ?";
    params.push(cidGroup);
  }
  if (range) {
    query += " AND a.range_class = ?";
    params.push(range);
  }
  if (status) {
    query += " AND a.status = ?";
    params.push(status);
  }

  const records = db.prepare(query).all(...params);
  res.json(records);
});

router.get("/absenteeism/:id", (req, res) => {
  const record = db.prepare(`
    SELECT a.*, u.name as unit_name, s.name as sector_name, usr.name as creator_name
    FROM absenteeism_records a
    JOIN units u ON a.unit_id = u.id
    JOIN sectors s ON a.sector_id = s.id
    JOIN users usr ON a.created_by = usr.id
    WHERE a.id = ?
  `).get(req.params.id);
  res.json(record);
});

router.put("/absenteeism/:id", (req, res) => {
  const { id } = req.params;
  const { unit_id, sector_id, shift_id, start_date, end_date, days_lost, range_class, cid_group, cid_code, notes, status, updated_by } = req.body;
  
  const before = db.prepare("SELECT * FROM absenteeism_records WHERE id = ?").get(id) as any;
  
  db.prepare(`
    UPDATE absenteeism_records 
    SET unit_id = ?, sector_id = ?, shift_id = ?, start_date = ?, end_date = ?, days_lost = ?, range_class = ?, cid_group = ?, cid_code = ?, notes = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(unit_id, sector_id, shift_id, start_date, end_date, days_lost, range_class, cid_group, cid_code, notes, status, id);
  
  logAudit(before.tenant_id, 'absenteeism', id, 'UPDATE', updated_by, before, req.body);
  
  res.json({ success: true });
});

router.patch("/absenteeism/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, updated_by } = req.body;
  
  const before = db.prepare("SELECT * FROM absenteeism_records WHERE id = ?").get(id) as any;
  
  db.prepare("UPDATE absenteeism_records SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
  
  logAudit(before.tenant_id, 'absenteeism', id, 'CONFIRM', updated_by, before, { status });
  
  res.json({ success: true });
});

router.delete("/absenteeism/:id", (req, res) => {
  const { id } = req.params;
  const { deleted_by } = req.query;
  
  const before = db.prepare("SELECT * FROM absenteeism_records WHERE id = ?").get(id) as any;
  if (before) {
    db.prepare("DELETE FROM absenteeism_records WHERE id = ?").run(id);
    logAudit(before.tenant_id, 'absenteeism', id, 'DELETE', deleted_by as string, before, null);
  }
  
  res.json({ success: true });
});

router.get("/absenteeism/:id/attachments", (req, res) => {
  const attachments = db.prepare("SELECT * FROM absenteeism_attachments WHERE record_id = ?").all(req.params.id);
  res.json(attachments);
});

router.post("/absenteeism/:id/attachments", (req, res) => {
  const { id: recordId } = req.params;
  const { file_url, file_name, file_type, created_by } = req.body;
  const id = `att-${Date.now()}`;
  db.prepare(`
    INSERT INTO absenteeism_attachments (id, record_id, file_url, file_name, file_type, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, recordId, file_url, file_name, file_type, created_by);
  res.json({ success: true, id });
});

router.delete("/absenteeism/attachments/:id", (req, res) => {
  db.prepare("DELETE FROM absenteeism_attachments WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.get("/absenteeism/:id/history", (req, res) => {
  const history = db.prepare(`
    SELECT a.*, u.name as user_name
    FROM audit_log a
    JOIN users u ON a.user_id = u.id
    WHERE a.entity_id = ? AND a.entity_type = 'absenteeism'
    ORDER BY a.created_at DESC
  `).all(req.params.id);
  res.json(history);
});

router.get("/reports/absenteeism/summary", (req, res) => {
  const { tenantId, month, year } = req.query;
  // Mocking summary for now
  res.json({
    totalDaysLost: 45,
    totalRecords: 12,
    over15Rate: 25,
    topCIDs: [
      { group: 'F', count: 5 },
      { group: 'I', count: 3 },
      { group: 'G', count: 2 },
    ],
    criticalSector: 'Montagem Cross',
    weeklyImpact: [
      { week: 'Semana 1', days: 10 },
      { week: 'Semana 2', days: 15 },
      { week: 'Semana 3', days: 8 },
      { week: 'Semana 4', days: 12 },
    ],
    cidDistribution: [
      { name: 'Grupo F', value: 45 },
      { name: 'Grupo G', value: 25 },
      { name: 'Grupo I', value: 20 },
      { name: 'Outros', value: 10 },
    ],
    sectorRanking: [
      { sector: 'Montagem Cross', days: 25 },
      { sector: 'Logística', days: 12 },
      { sector: 'Pintura', days: 8 },
    ]
  });
});

// --- NR1 Psicossocial (Overhauled) ---
router.get("/nr1/forms", (req, res) => {
  const { tenantId } = req.query;
  const forms = db.prepare("SELECT * FROM nr1_forms WHERE tenant_id = ? ORDER BY created_at DESC").all(tenantId);
  res.json(forms.map((f: any) => ({ 
    ...f, 
    fields_json: JSON.parse(f.fields_json),
    scoring_json: JSON.parse(f.scoring_json || '{}'),
    privacy_json: JSON.parse(f.privacy_json || '{}')
  })));
});

router.post("/nr1/forms", (req, res) => {
  const { id, tenant_id, name, fields_json, scoring_json, privacy_json, created_by } = req.body;
  db.prepare(`
    INSERT INTO nr1_forms (id, tenant_id, name, fields_json, scoring_json, privacy_json, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, tenant_id, name, JSON.stringify(fields_json), JSON.stringify(scoring_json), JSON.stringify(privacy_json), created_by);
  res.json({ success: true });
});

router.get("/nr1/forms/:id", (req, res) => {
  const form = db.prepare("SELECT * FROM nr1_forms WHERE id = ?").get(req.params.id) as any;
  if (!form) return res.status(404).json({ error: "Form not found" });
  res.json({
    ...form,
    fields_json: JSON.parse(form.fields_json),
    scoring_json: JSON.parse(form.scoring_json || '{}'),
    privacy_json: JSON.parse(form.privacy_json || '{}')
  });
});

router.put("/nr1/forms/:id", (req, res) => {
  const { id } = req.params;
  const { name, fields_json, scoring_json, privacy_json } = req.body;
  db.prepare(`
    UPDATE nr1_forms 
    SET name = ?, fields_json = ?, scoring_json = ?, privacy_json = ?
    WHERE id = ? AND status = 'DRAFT'
  `).run(name, JSON.stringify(fields_json), JSON.stringify(scoring_json), JSON.stringify(privacy_json), id);
  res.json({ success: true });
});

router.post("/nr1/forms/:id/publish", (req, res) => {
  db.prepare("UPDATE nr1_forms SET status = 'PUBLISHED' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.post("/nr1/forms/:id/duplicate", (req, res) => {
  const { id } = req.params;
  const { newId, created_by } = req.body;
  const form = db.prepare("SELECT * FROM nr1_forms WHERE id = ?").get(id) as any;
  if (!form) return res.status(404).json({ error: "Form not found" });
  
  db.prepare(`
    INSERT INTO nr1_forms (id, tenant_id, name, version, status, fields_json, scoring_json, privacy_json, created_by)
    VALUES (?, ?, ?, ?, 'DRAFT', ?, ?, ?, ?)
  `).run(newId, form.tenant_id, `${form.name} (Cópia)`, form.version + 1, form.fields_json, form.scoring_json, form.privacy_json, created_by);
  
  res.json({ success: true });
});

router.patch("/nr1/forms/:id/archive", (req, res) => {
  db.prepare("UPDATE nr1_forms SET status = 'ARCHIVED' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Cycles
router.get("/nr1/cycles", (req, res) => {
  const { tenantId, status } = req.query;
  let query = "SELECT c.*, f.name as form_name FROM nr1_cycles c JOIN nr1_forms f ON c.form_id = f.id WHERE c.tenant_id = ?";
  const params: any[] = [tenantId];
  if (status) {
    query += " AND c.status = ?";
    params.push(status);
  }
  query += " ORDER BY c.created_at DESC";
  const cycles = db.prepare(query).all(...params);
  res.json(cycles.map((c: any) => ({
    ...c,
    sectors_json: JSON.parse(c.sectors_json),
    privacy_json: JSON.parse(c.privacy_json || '{}')
  })));
});

router.post("/nr1/cycles", (req, res) => {
  const { id, tenant_id, form_id, form_version, name, start_date, end_date, unit_id, sectors_json, privacy_json, public_token, created_by } = req.body;
  db.prepare(`
    INSERT INTO nr1_cycles (id, tenant_id, form_id, form_version, name, start_date, end_date, unit_id, sectors_json, privacy_json, public_token, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, tenant_id, form_id, form_version, name, start_date, end_date, unit_id, JSON.stringify(sectors_json), JSON.stringify(privacy_json), public_token, created_by);
  res.json({ success: true });
});

router.get("/nr1/cycles/:id", (req, res) => {
  const cycle = db.prepare(`
    SELECT c.*, f.name as form_name, f.fields_json as form_fields
    FROM nr1_cycles c 
    JOIN nr1_forms f ON c.form_id = f.id 
    WHERE c.id = ?
  `).get(req.params.id) as any;
  if (!cycle) return res.status(404).json({ error: "Cycle not found" });
  res.json({
    ...cycle,
    sectors_json: JSON.parse(cycle.sectors_json),
    privacy_json: JSON.parse(cycle.privacy_json || '{}'),
    form_fields: JSON.parse(cycle.form_fields)
  });
});

router.post("/nr1/cycles/:id/activate", (req, res) => {
  db.prepare("UPDATE nr1_cycles SET status = 'ACTIVE' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.post("/nr1/cycles/:id/close", (req, res) => {
  db.prepare("UPDATE nr1_cycles SET status = 'CLOSED' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.delete("/nr1/cycles/:id", (req, res) => {
  db.prepare("DELETE FROM nr1_cycles WHERE id = ? AND status = 'DRAFT'").run(req.params.id);
  res.json({ success: true });
});

// Public Submission
router.get("/nr1/public/:publicToken", (req, res) => {
  const cycle = db.prepare(`
    SELECT c.*, f.name as form_name, f.fields_json as form_fields
    FROM nr1_cycles c 
    JOIN nr1_forms f ON c.form_id = f.id 
    WHERE c.public_token = ? AND c.status = 'ACTIVE'
  `).get(req.params.publicToken) as any;
  
  if (!cycle) return res.status(404).json({ error: "Cycle not found or inactive" });
  
  res.json({
    id: cycle.id,
    name: cycle.name,
    form_name: cycle.form_name,
    form_fields: JSON.parse(cycle.form_fields),
    unit_id: cycle.unit_id,
    sectors: JSON.parse(cycle.sectors_json)
  });
});

router.post("/nr1/public/:publicToken/submit", (req, res) => {
  const { publicToken } = req.params;
  const { sectorId, answers, scoreTotal, scoreBlocks } = req.body;
  
  const cycle = db.prepare("SELECT id FROM nr1_cycles WHERE public_token = ? AND status = 'ACTIVE'").get(publicToken) as any;
  if (!cycle) return res.status(404).json({ error: "Cycle not found or inactive" });
  
  const responseId = `resp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  db.transaction(() => {
    db.prepare(`
      INSERT INTO nr1_responses (id, cycle_id, sector_id, answers_json, score_total, score_blocks_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(responseId, cycle.id, sectorId, JSON.stringify(answers), scoreTotal, JSON.stringify(scoreBlocks));
    
    // Update aggregate cache (simplified for now)
    const existing = db.prepare("SELECT * FROM nr1_aggregate_cache WHERE cycle_id = ? AND sector_id = ?").get(cycle.id, sectorId) as any;
    if (existing) {
      const newCount = existing.responses_count + 1;
      const newScoreAvg = (existing.score_avg * existing.responses_count + scoreTotal) / newCount;
      db.prepare(`
        UPDATE nr1_aggregate_cache 
        SET responses_count = ?, score_avg = ?, updated_at = CURRENT_TIMESTAMP
        WHERE cycle_id = ? AND sector_id = ?
      `).run(newCount, newScoreAvg, cycle.id, sectorId);
    } else {
      db.prepare(`
        INSERT INTO nr1_aggregate_cache (cycle_id, sector_id, responses_count, score_avg)
        VALUES (?, ?, 1, ?)
      `).run(cycle.id, sectorId, scoreTotal);
    }
  })();
  
  res.json({ success: true });
});

// Dashboard / Summary
router.get("/nr1/dashboard", (req, res) => {
  const { cycleId } = req.query;
  const cycle = db.prepare("SELECT * FROM nr1_cycles WHERE id = ?").get(cycleId) as any;
  if (!cycle) return res.status(404).json({ error: "Cycle not found" });
  
  const aggregates = db.prepare(`
    SELECT ac.*, s.name as sector_name
    FROM nr1_aggregate_cache ac
    JOIN sectors s ON ac.sector_id = s.id
    WHERE ac.cycle_id = ?
  `).all(cycleId);
  
  const totalResponses = aggregates.reduce((acc: number, curr: any) => acc + curr.responses_count, 0);
  const avgScore = aggregates.length > 0 
    ? aggregates.reduce((acc: number, curr: any) => acc + curr.score_avg, 0) / aggregates.length 
    : 0;
    
  res.json({
    cycle,
    totalResponses,
    avgScore,
    aggregates
  });
});

router.get("/nr1/summary/by-sector", (req, res) => {
  const { cycleId } = req.query;
  const aggregates = db.prepare(`
    SELECT ac.*, s.name as sector_name
    FROM nr1_aggregate_cache ac
    JOIN sectors s ON ac.sector_id = s.id
    WHERE ac.cycle_id = ?
  `).all(cycleId);
  res.json(aggregates);
});

router.get("/nr1/responses", (req, res) => {
  const { cycleId } = req.query;
  const responses = db.prepare(`
    SELECT r.*, s.name as sector_name
    FROM nr1_responses r
    LEFT JOIN sectors s ON r.sector_id = s.id
    WHERE r.cycle_id = ?
    ORDER BY r.submitted_at DESC
  `).all(cycleId);
  res.json(responses.map((r: any) => ({
    ...r,
    answers_json: JSON.parse(r.answers_json),
    score_blocks_json: JSON.parse(r.score_blocks_json || '{}')
  })));
});

// --- Central de Relatórios ---
router.post("/reports/generate", (req, res) => {
  const { tenantId, name, type, format, params, created_by } = req.body;
  const id = `job-${Date.now()}`;
  
  db.prepare(`
    INSERT INTO report_jobs (id, tenant_id, type, params_json, status)
    VALUES (?, ?, ?, ?, 'PROCESSING')
  `).run(id, tenantId, type, JSON.stringify(params));
  
  // Simulate background processing
  setTimeout(() => {
    db.prepare("UPDATE report_jobs SET status = 'COMPLETED', file_url = ? WHERE id = ?")
      .run(`#`, id);
  }, 5000);
  
  res.json({ success: true, id });
});

router.get("/reports/history", (req, res) => {
  const { tenantId } = req.query;
  const history = db.prepare("SELECT * FROM report_jobs WHERE tenant_id = ? ORDER BY created_at DESC").all(tenantId);
  res.json(history.map((h: any) => ({ ...h, params: JSON.parse(h.params_json || '{}') })));
});

router.delete("/reports/:id", (req, res) => {
  db.prepare("DELETE FROM report_jobs WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.post("/reports/:id/retry", (req, res) => {
  const job = db.prepare("SELECT * FROM report_jobs WHERE id = ?").get(req.params.id) as any;
  if (!job) return res.status(404).json({ error: "Job not found" });
  
  const newId = `job-${Date.now()}`;
  db.prepare(`
    INSERT INTO report_jobs (id, tenant_id, type, params_json, status)
    VALUES (?, ?, ?, ?, 'PROCESSING')
  `).run(newId, job.tenant_id, job.type, job.params_json);
  
  setTimeout(() => {
    db.prepare("UPDATE report_jobs SET status = 'COMPLETED', file_url = ? WHERE id = ?")
      .run(`#`, newId);
  }, 5000);
  
  res.json({ success: true, id: newId });
});

router.get("/reports/templates", (req, res) => {
  const { tenantId } = req.query;
  const templates = db.prepare("SELECT * FROM report_templates WHERE tenant_id = ?").all(tenantId);
  res.json(templates.map((t: any) => ({ ...t, params: JSON.parse(t.params_json), isDefault: !!t.is_default })));
});

router.post("/reports/templates", (req, res) => {
  const { id, tenant_id, name, type, params, is_default, created_by } = req.body;
  db.prepare(`
    INSERT INTO report_templates (id, tenant_id, name, type, params_json, is_default, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, tenant_id, name, type, JSON.stringify(params), is_default ? 1 : 0, created_by);
  res.json({ success: true });
});

router.delete("/reports/templates/:id", (req, res) => {
  db.prepare("DELETE FROM report_templates WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

router.post("/reports/share", (req, res) => {
  const { report_id, report_name, expires_at, has_password, password } = req.body;
  const id = `share-${Date.now()}`;
  const token = Math.random().toString(36).substring(2, 15);
  
  db.prepare(`
    INSERT INTO report_shares (id, report_id, report_name, token, expires_at, has_password, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, report_id, report_name, token, expires_at, has_password ? 1 : 0, password);
  
  res.json({ success: true, token });
});

router.get("/reports/shares", (req, res) => {
  const { tenantId } = req.query;
  // This is a bit complex because report_shares doesn't have tenant_id directly
  // We join with report_jobs
  const shares = db.prepare(`
    SELECT s.* 
    FROM report_shares s
    JOIN report_jobs j ON s.report_id = j.id
    WHERE j.tenant_id = ?
    ORDER BY s.created_at DESC
  `).all(tenantId);
  res.json(shares.map((s: any) => ({ ...s, has_password: !!s.has_password })));
});

router.post("/reports/shares/:id/revoke", (req, res) => {
  db.prepare("UPDATE report_shares SET status = 'REVOKED' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// --- Admissional (Cinesiofuncional) ---
router.get("/admission/templates", (req, res) => {
  const { tenantId } = req.query;
  const templates = db.prepare("SELECT * FROM admission_templates WHERE tenant_id = ?").all(tenantId);
  res.json(templates.map((t: any) => ({ ...t, fields_json: JSON.parse(t.fields_json) })));
});

router.post("/admission/templates", (req, res) => {
  const { id, tenant_id, role_name, fields_json, created_by } = req.body;
  db.prepare(`
    INSERT INTO admission_templates (id, tenant_id, role_name, fields_json, created_by)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, tenant_id, role_name, JSON.stringify(fields_json), created_by);
  res.json({ success: true });
});

router.get("/admission/evaluations", (req, res) => {
  const { tenantId, unitId, sectorId, result } = req.query;
  let query = `
    SELECT e.*, u.name as unit_name, s.name as sector_name
    FROM admission_evaluations e
    JOIN units u ON e.unit_id = u.id
    JOIN sectors s ON e.sector_id = s.id
    WHERE e.tenant_id = ?
  `;
  const params: any[] = [tenantId];

  if (unitId) {
    query += " AND e.unit_id = ?";
    params.push(unitId);
  }
  if (sectorId) {
    query += " AND e.sector_id = ?";
    params.push(sectorId);
  }
  if (result) {
    query += " AND e.result = ?";
    params.push(result);
  }

  const evaluations = db.prepare(query).all(...params);
  res.json(evaluations.map((e: any) => ({ 
    ...e, 
    reasons_json: JSON.parse(e.reasons_json || '[]'),
    scores_json: JSON.parse(e.scores_json || '{}')
  })));
});

router.post("/admission/evaluations", (req, res) => {
  const { id, tenant_id, unit_id, sector_id, role_name, template_id, evaluation_date, result, reasons_json, scores_json, notes, created_by } = req.body;
  db.prepare(`
    INSERT INTO admission_evaluations (id, tenant_id, unit_id, sector_id, role_name, template_id, evaluation_date, result, reasons_json, scores_json, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, tenant_id, unit_id, sector_id, role_name, template_id, evaluation_date, result, JSON.stringify(reasons_json), JSON.stringify(scores_json), notes, created_by);
  res.json({ success: true });
});

router.get("/reports/admission/summary", (req, res) => {
  const { tenantId } = req.query;
  // Mocking summary
  res.json({
    totalEvaluations: 156,
    recommendedRate: 88,
    restrictedRate: 7,
    notRecommendedRate: 5,
    topCriticalRoles: [
      { role: 'Operador de Empilhadeira', count: 4 },
      { role: 'Montador', count: 2 },
      { role: 'Logística', count: 1 },
    ],
    resultDistribution: [
      { name: 'Recomendado', value: 88 },
      { name: 'Restrição', value: 7 },
      { name: 'Não Recomendado', value: 5 },
    ],
    roleRanking: [
      { role: 'Operador de Empilhadeira', value: 12 },
      { role: 'Montador', value: 8 },
      { role: 'Logística', value: 5 },
    ],
    monthlyTrend: [
      { month: 'Jan', rate: 4 },
      { month: 'Fev', rate: 6 },
      { month: 'Mar', rate: 5 },
    ],
    frequentReasons: [
      { reason: 'Dor lombar', count: 8 },
      { reason: 'Lesão ombro', count: 5 },
      { reason: 'Limitação mobilidade', count: 3 },
    ]
  });
});

// Strategic Dashboard Endpoints
router.get("/dashboard/strategic/:tenantId", (req, res) => {
  const { tenantId } = req.params;
  const { year = 2026, compareYear = 2025, baselineYear = 2022 } = req.query;

  // Mocking strategic data
  const strategicData = {
    summary: {
      participation: { current: 84.2, previous: 78.5, baseline: 62.0, meta: 80 },
      checkins: { current: 12450, previous: 11200, baseline: 8500, avg_month: 1037 },
      complaints: { 
        momentary: { current: 142, previous: 168, baseline: 245 },
        ambulatory: { current: 45, previous: 52, baseline: 88 }
      },
      rehabilitated: { current: 88, previous: 72, baseline: 45 },
      absenteeism: { 
        days: { current: 450, previous: 520, baseline: 850 },
        split_under_15: 320,
        split_over_15: 130
      },
      critical_sectors: [
        { name: "Produção A", complaints: 24, absenteeism: 45 },
        { name: "Logística", complaints: 18, absenteeism: 32 },
        { name: "Manutenção", complaints: 15, absenteeism: 28 }
      ],
      nr1: { adhesion: 92, high_risk_sectors: 4 },
      action_plan: { completed: 85, delayed: 12 }
    },
    historical: {
      baseline_vs_current: [
        { month: 'Jan', baseline: 45, current: 32 },
        { month: 'Fev', baseline: 42, current: 30 },
        { month: 'Mar', baseline: 48, current: 35 },
        { month: 'Abr', baseline: 40, current: 28 },
        { month: 'Mai', baseline: 38, current: 25 },
        { month: 'Jun', baseline: 44, current: 31 },
        { month: 'Jul', baseline: 46, current: 33 },
        { month: 'Ago', baseline: 43, current: 29 },
        { month: 'Set', baseline: 41, current: 27 },
        { month: 'Out', baseline: 39, current: 26 },
        { month: 'Nov', baseline: 45, current: 30 },
        { month: 'Dez', baseline: 47, current: 34 },
      ],
      trends_5_years: [
        { year: 2022, complaints: 333, absenteeism: 850, participation: 62 },
        { year: 2023, complaints: 290, absenteeism: 720, participation: 68 },
        { year: 2024, complaints: 250, absenteeism: 610, participation: 74 },
        { year: 2025, complaints: 220, absenteeism: 520, participation: 78 },
        { year: 2026, complaints: 187, absenteeism: 450, participation: 84 },
      ]
    },
    risk_matrix: [
      { sector: 'Produção A', risk: 'Alto', complaints: 24, previous_risk: 'Alto' },
      { sector: 'Produção B', risk: 'Médio', complaints: 12, previous_risk: 'Alto' },
      { sector: 'Logística', risk: 'Médio', complaints: 18, previous_risk: 'Médio' },
      { sector: 'Manutenção', risk: 'Baixo', complaints: 8, previous_risk: 'Médio' },
      { sector: 'Administrativo', risk: 'Baixo', complaints: 2, previous_risk: 'Baixo' },
    ],
    body_structure_yoy: [
      { part: 'Ombro', current: 42, previous: 48 },
      { part: 'Lombar', current: 28, previous: 35 },
      { part: 'Pescoço', current: 15, previous: 12 },
      { part: 'Punhos', current: 10, previous: 14 },
      { part: 'Outros', current: 5, previous: 8 },
    ],
    health_funnel: [
      { name: 'Queixa Momentânea', value: 142, fill: '#8884d8' },
      { name: 'Ambulatorial', value: 45, fill: '#83a6ed' },
      { name: 'Afastamento', value: 12, fill: '#8dd1e1' },
    ],
    absenteeism_cid: [
      { month: 'Jan', F: 10, G: 5, I: 2 },
      { month: 'Fev', F: 8, G: 4, I: 3 },
      { month: 'Mar', F: 12, G: 6, I: 1 },
      { month: 'Abr', F: 9, G: 3, I: 4 },
      { month: 'Mai', F: 7, G: 5, I: 2 },
      { month: 'Jun', F: 11, G: 4, I: 3 },
    ],
    admissionals: {
      recommended: 450,
      not_recommended: 24,
      reasons: [
        { name: 'Ergonômico', value: 12 },
        { name: 'Clínico', value: 8 },
        { name: 'Psicossocial', value: 4 },
      ]
    }
  };

  res.json(strategicData);
});

export default router;
