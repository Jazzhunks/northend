// Centralized role definitions for the Northend application
export const ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  CENTER_MANAGER: 'center_manager',
  ACCOUNTANT: 'accountant',
  COUNSELLOR: 'counsellor',
  SCHOOL: 'school',
  STUDENT: 'student',
};

// Role groups
export const ERP_ROLES = [
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
  ROLES.CENTER_MANAGER,
  ROLES.ACCOUNTANT,
  ROLES.COUNSELLOR,
];

export const ADMIN_ONLY = [ROLES.ADMIN];
export const SCHOOL_ONLY = [ROLES.SCHOOL];
