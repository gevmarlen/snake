import { Game } from './game'

export class Snake extends Game {
  private snakeArray: { x: number; y: number }[]
  private food: { x: number; y: number } = { x: 0, y: 0 }
  private timer: any
  private timerSpeed: number = 100
  private direction: string = 'right'
  private score: number = 0
  private message: string = 'Press any key'

  constructor(canvasSelector: string, cellSize: number, n: number, m: number) {
    super(canvasSelector, cellSize, n, m)

    this.createSnake()
    this.createFood()
    this.paint()

    document.addEventListener('keydown', event => {
      let key = event.which

      if (!this.isGameStarted) {
        this.play()
      }

      if (key === 37 && this.direction != 'right' && this.direction != 'left') {
        this.direction = 'left'
        this.changeDirection()
      } else if (key === 38 && this.direction != 'down' && this.direction != 'up') {
        this.direction = 'up'
        this.changeDirection()
      } else if (key === 39 && this.direction != 'left' && this.direction != 'right') {
        this.direction = 'right'
        this.changeDirection()
      } else if (key === 40 && this.direction != 'up' && this.direction != 'down') {
        this.direction = 'down'
        this.changeDirection()
      } else if (key === 80) {
        this.pause()
      } else if (key === 82) {
        this.reStart()
      }
    })
  }

  private createSnake(): void {
    let length = 6

    this.snakeArray = []

    for (let i = length - 1; i >= 0; i--) {
      this.snakeArray.push({ x: i + Math.round(this.n / 2) - Math.round(length / 2), y: Math.round(this.m / 2) })
    }
  }

  private createFood(): void {
    this.food.x = Math.round(Math.random() * (this.n - 1))
    this.food.y = Math.round(Math.random() * (this.m - 1))

    for (let i = 0; i < this.snakeArray.length; i++) {
      if (this.food.x === this.snakeArray[i].x && this.food.y === this.snakeArray[i].y) {
        this.createFood()
        break
      }
    }
  }

  private paint(): void {
    this.ctx.lineWidth = 0.02

    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.n * this.cellSize, this.m * this.cellSize)
    this.ctx.strokeStyle = 'black'

    this.ctx.beginPath()

    for (let i = 1; i < Math.max(this.n, this.m); i++) {
      this.ctx.moveTo(i * this.cellSize, 0)
      this.ctx.lineTo(i * this.cellSize, this.height)
      this.ctx.moveTo(0, i * this.cellSize)
      this.ctx.lineTo(this.width, i * this.cellSize)
    }

    this.ctx.stroke()

    for (let i = 0; i < this.snakeArray.length; i++) {
      if (i == 0) {
        this.paintCell(this.snakeArray[i].x, this.snakeArray[i].y, 'green', true)
      } else {
        this.paintCell(this.snakeArray[i].x, this.snakeArray[i].y)
      }
    }

    this.paintCell(this.food.x, this.food.y, 'red')

    this.ctx.fillStyle = 'black'

    this.ctx.font = '24px ArcadeClassic'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(this.message, (this.n / 2) * this.cellSize, (this.m / 2) * this.cellSize - 10)

    this.ctx.font = '16px ArcadeClassic'
    this.ctx.textAlign = 'left'
    this.ctx.fillText('Score: ' + this.score, 5, this.m * this.cellSize - 5)
  }

  private step(): void {
    let nx = this.snakeArray[0].x
    let ny = this.snakeArray[0].y

    if (this.direction == 'right') nx++
    else if (this.direction == 'left') nx--
    else if (this.direction == 'up') ny--
    else if (this.direction == 'down') ny++

    if (nx == -1) {
      nx = this.n - 1
    } else if (ny == -1) {
      ny = this.m - 1
    } else if (nx == this.n) {
      nx = 0
    } else if (ny == this.m) {
      ny = 0
    }

    this.checkCollision(nx, ny, this.snakeArray)

    if (nx == this.food.x && ny == this.food.y) {
      let tail = { x: nx, y: ny }
      this.score++
      this.createFood()
      this.snakeArray.unshift(tail)
    } else {
      let tail = this.snakeArray.pop()
      tail.x = nx
      tail.y = ny
      this.snakeArray.unshift(tail)
    }

    this.timerSpeed = 100 - Math.round(this.snakeArray.length / 2)
  }

  private paintCell(x: number, y: number, color: string = 'black', isHead: boolean = false): void {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
    this.ctx.strokeStyle = 'white'
    this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)

    if (isHead) {
      this.ctx.fillStyle = 'red'
      switch (this.direction) {
        case 'right':
          this.ctx.fillRect(x * this.cellSize + this.cellSize, y * this.cellSize + this.cellSize / 2 - 1, 3, 2)
          break
        case 'left':
          this.ctx.fillRect(x * this.cellSize - 3, y * this.cellSize + this.cellSize / 2 - 1, 3, 2)
          break
        case 'up':
          this.ctx.fillRect(x * this.cellSize + this.cellSize / 2 - 1, y * this.cellSize - 3, 2, 3)
          break
        case 'down':
          this.ctx.fillRect(x * this.cellSize + this.cellSize / 2 - 1, y * this.cellSize + this.cellSize, 2, 3)
          break
      }
    }
  }

  private checkCollision(x: number, y: number, array: { x: number; y: number }[]): void {
    for (let i = 1; i < array.length; i++) {
      if (array[0].x == array[i].x && array[0].y == array[i].y) {
        this.score -= array.length - i
        array.length = i
      }
    }
  }

  private reStart(): Snake {
    this.isGameStarted = false
    this.message = 'Press any key'
    this.direction = 'right'

    this.createSnake()
    this.createFood()

    this.score = 0

    this.paint()

    if (typeof this.timer !== 'undefined') {
      clearInterval(this.timer)
    }

    return this
  }

  private play(): Snake {
    this.isGameStarted = true
    this.message = ''

    if (typeof this.timer !== 'undefined') {
      clearInterval(this.timer)
    }
    this.timer = setInterval(() => {
      this.loop()
    }, this.timerSpeed)

    return this
  }

  private pause(): Snake {
    this.isGameStarted = false
    this.message = 'Pause'

    this.paint()

    if (typeof this.timer !== 'undefined') {
      clearInterval(this.timer)
    }

    return this
  }

  changeDirection() {
    clearInterval(this.timer)

    this.isGameStarted = true
    this.message = ''

    this.loop()

    this.timer = setInterval(() => {
      this.loop()
    }, this.timerSpeed)
  }

  protected loop(): void {
    this.step()
    this.paint()
  }
}
