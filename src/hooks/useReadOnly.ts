export function useReadOnly(): boolean {
  const role = (window as any).__atividade_role || '';
  return role === 'client' || role === 'auditor';
}
