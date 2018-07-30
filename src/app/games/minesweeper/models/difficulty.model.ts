export class Difficulty {
  constructor(public readonly name: string,
    public readonly columns: number,
    public readonly rows: number,
    public readonly mines: number,
    public readonly isCustom = false) {}

  public static getDifficulties() {
    return [
      new Difficulty('Beginner', 9, 9, 10),
      new Difficulty('Intermediate', 16, 16, 40),
      new Difficulty('Expert', 30, 16, 99),
      new Difficulty('Custom', -1, -1, -1, true)
    ];
  }
}
