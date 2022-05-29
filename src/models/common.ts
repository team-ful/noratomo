export enum Gender {
  NotNone = 0,
  Male = 1,
  Female = 2,
  NotApplicable = 3,
}

/**
 * enum Genderをnumberからparseする
 *
 * @param {number} row - row gender
 * @returns {Gender} gender enum
 */
export function gender(row?: number): Gender {
  let g: Gender = Gender.NotNone;
  if (row) {
    switch (row) {
      case 0:
        g = Gender.NotNone;
        break;
      case 1:
        g = Gender.Male;
        break;
      case 2:
        g = Gender.Female;
        break;
      case 3:
        g = Gender.NotApplicable;
        break;
    }
  }

  return g;
}
