export enum TypeLogExperienceActivity {
  LOGIN = 'login',
}

export enum TypeLogExperienceOperation {
  PLUS = '+',
  MINUS = '-',
}

export enum TypeLogExperienceStatus {
  NORMAL = 'normal',
  DELETE = 'delete',
  BLOCK = 'block',
}

export const MaestroLogExperienceActivityPoint = {
  [TypeLogExperienceActivity.LOGIN]: 30,
};
