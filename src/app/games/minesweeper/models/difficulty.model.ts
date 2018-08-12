export class Difficulty {
  public static readonly Beginner = 'Beginner';
  public static readonly Intermediate = 'Intermediate';
  public static readonly Expert = 'Expert';
  public static readonly Custom = 'Custom';

  private static readonly difficulties = [
    new Difficulty(Difficulty.Beginner, 9, 9, 10),
    new Difficulty(Difficulty.Intermediate, 16, 16, 40),
    new Difficulty(Difficulty.Expert, 30, 16, 99),
    new Difficulty(Difficulty.Custom, -1, -1, -1, true)
  ];

  constructor(public readonly name: string,
    public readonly columns: number,
    public readonly rows: number,
    public readonly mines: number,
    public readonly isCustom = false) {}

  public static getDifficulties() {
    return Difficulty.difficulties;
  }
}
