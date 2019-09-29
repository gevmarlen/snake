export abstract class Game {
  protected cellSize: number = 15
  protected n: number = 40
  protected m: number = 20
  protected ctx: CanvasRenderingContext2D
  protected width: number
  protected height: number
  protected isGameStarted: boolean = false
  protected isGameOver: boolean = false

  constructor(canvasSelector: string, cellSize: number, n: number, m: number) {
    const canvas = <HTMLCanvasElement>document.querySelector(canvasSelector)

    this.ctx = canvas.getContext('2d')

    this.cellSize = cellSize
    this.n = n
    this.m = m

    this.width = this.n * this.cellSize
    this.height = this.m * this.cellSize

    canvas.width = this.width
    canvas.style.width = this.width.toString()
    canvas.height = this.height
    canvas.style.height = this.height.toString()
  }

  protected grid() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.lineWidth = 0.02

    this.ctx.beginPath()

    for (let i = 1; i < Math.max(this.n, this.m); i++) {
      this.ctx.moveTo(i * this.cellSize, 0)
      this.ctx.lineTo(i * this.cellSize, this.height)
      this.ctx.moveTo(0, i * this.cellSize)
      this.ctx.lineTo(this.width, i * this.cellSize)
    }

    this.ctx.stroke()
  }

  protected abstract loop(): void
}
