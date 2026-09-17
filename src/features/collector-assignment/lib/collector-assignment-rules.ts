import "server-only";

export function canDeactivateAssignment(isActive: boolean): boolean {
  return isActive === true;
}
