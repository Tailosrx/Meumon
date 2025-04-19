document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector(".grid")
    const scoreDisplay = document.getElementById("score")
    const width = 8
    const squares = []
    let score = 0
    
    const candyColors = [
      'red',
      'yellow',
      'orange',
      'purple',
      'green',
      'blue'
    ]
    
   //Red //https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvZnJzdHJhd2JlcnJ5X3JlZF9kZWxpY2lvdXNfc3dlZXQtaW1hZ2Utam9iNjIxXzEucG5n.png?s=O9rD3r9TPQwp8sYi44WZzEuB-t4HG6qQ80CuIYrCZ4A
    //https://w7.pngwing.com/pngs/348/177/png-transparent-strawberry-aedmaasikas-fruit-3d-of-fruit-material-food-strawberries-3d-thumbnail.png
    
    //Yellow
    //https://png.pngtree.com/png-vector/20210522/ourmid/pngtree-banana-yellow-fruit-png-image_3312896.png
    //https://mpng.subpng.com/20180610/xxx/kisspng-banana-bread-banana-pudding-muffin-small-yellow-people-5b1de8717fae45.344698771528686705523.jpg
    
    //Orange
    //https://w7.pngwing.com/pngs/187/615/png-transparent-orange-fruit-orange-tangerine-orange-natural-foods-food-citrus.png
    
    //purple
    //https://toppng.com/uploads/preview/purple-grapes-png-11526069718zjzctddhgb.png
    //https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwAdCQXn8lqPJSuCnvOQg5oK3M8t2p-_X07A&usqp=CAU
    //https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrOMY8yR3iI8Ux20BrPbrzBNenNSV-ZwZGjw&usqp=CAU
    
    //Green
    //https://image.similarpng.com/very-thumbnail/2021/01/Watermelon-fruit-is-sweet-on-transparent-background-PNG.png
    //https://img.favpng.com/2/16/6/kiwifruit-png-favpng-ui1pF9pBRVH7Bju0Ty5kJ07SG.jpg
    
    //Blue
    //https://e7.pngegg.com/pngimages/946/644/png-clipart-blueberry-tea-smoothie-bilberry-juice-blueberry-food-blueberry.png
    //https://banner2.cleanpng.com/20180517/pwq/kisspng-muffin-highbush-blueberry-clip-art-5afe09e83be096.2281521815265981202453.jpg
    //https://e7.pngegg.com/pngimages/761/212/png-clipart-blueberry-illustration-frutti-di-bosco-blueberry-fruit-blueberry-food-cartoon-thumbnail.png
    //https://e7.pngegg.com/pngimages/172/591/png-clipart-blueberry-pie-blueberries-for-sal-antioxidant-blueberry-natural-foods-dried-fruit-thumbnail.png
    
    
    // Create Board
    function createBoard(){
      for(let i = 0; i < width * width; i++){
        const square = document.createElement('div')
        square.setAttribute('draggable', true)
        square.setAttribute('id', i)
        
        let randomColor = Math.floor(Math.random() * candyColors.length)
        square.style.backgroundColor = candyColors[randomColor]
        
        grid.appendChild(square)
        squares.push(square)
      }
    }
    
    createBoard()
  
  
  
  
  // Drag the candies
  let colorBeingDragged
  let colorBeingReplaced
  let squareIdBeingDragged
  let squareIdBeingReplaced
    
  squares.forEach(square => square.addEventListener('dragstart', dragStart))
  squares.forEach(square => square.addEventListener('dragend', dragEnd))
  squares.forEach(square => square.addEventListener('dragover', dragOver))
  squares.forEach(square => square.addEventListener('dragenter', dragEnter))
  squares.forEach(square => square.addEventListener('dragleave', dragLeave))
  squares.forEach(square => square.addEventListener('drop', dragDrop))
  
    
  function dragStart(){
    colorBeingDragged = this.style.backgroundColor
    squareIdBeingDragged = parseInt(this.id)
    
    console.log(colorBeingDragged)
    console.log(this.id, "dragstart")
  }
    
  function dragOver(e){
    e.preventDefault()
    console.log(this.id, "dragover")
  }
    
  function dragEnter(e){
    e.preventDefault()
    console.log(this.id, "dragenter")
  }
    
  function dragLeave(){
    console.log(this.id, "dragleave")
  }
    
  function dragDrop(){
    colorBeingReplaced = this.style.backgroundColor
    squareIdBeingReplaced = parseInt(this.id)
    this.style.backgroundColor = colorBeingDragged
    
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced
    // squares[squareIdBeingReplaced].style.backgroundColor = colorBeingDragged
    
    console.log(this.id, "drop")
  }
    
  function dragEnd(){
    console.log(this.id, "dragend")
    // What is a Valid Move?
    let validMoves = [
      squareIdBeingDragged -1, 
      squareIdBeingDragged -width,
      squareIdBeingDragged +1,
      squareIdBeingDragged +width
    ]
    let validMove = validMoves.includes(squareIdBeingReplaced)
    
    
    if(squareIdBeingReplaced && validMove){
      squareIdBeingReplaced = null
    } else if (squareIdBeingReplaced && !validMove){
      squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced
      squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged
    } else {
      squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged
    }
  }
    
    
    // Drop candies down once some have been cleared
    function moveDown(){
      for (i = 0; i < 55; i++){
        if(squares[i + width].style.backgroundColor === 'white'){
          squares[i + width].style.backgroundColor = squares[i].style.backgroundColor
          squares[i].style.backgroundColor = 'white'
          const firtRow = [0, 1, 2, 3, 4, 5, 6, 7]
          const isFirstRow = firtRow.includes(i)
          
          if(isFirstRow && squares[i].style.backgroundColor === 'white'){
            let randomColor = Math.floor(Math.random() * candyColors.length)
            squares[i].style.backgroundColor = candyColors[randomColor]
          } 
        }
      }
    }
    
    
    
    
        // Checking for matches
    
    //check for row of Five
    function checkRowForFive(){
      for (i = 0; i < 59; i++){
        let rowForFive = [i, i+1, i+2, i+3, i+4]
        let decidedColor = squares[i].style.backgroundColor
        const isBlank = squares[i].style.backgroundColor === 'white'
        
        const notValid = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52, 53, 54, 55]
        if (notValid.includes(i)) continue
        
        if (rowForFive.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)){
          score += 5
          scoreDisplay.innerHTML = score
          rowForFive.forEach(index => {
            squares[index].style.backgroundColor = 'white'
            console.log("test")
          })
        }
      }
    }
    checkRowForFive()
    
    
    //check for row of Four
    function checkRowForFour(){
      for (i = 0; i < 60; i++){
        let rowForFour = [i, i+1, i+2, i+3]
        let decidedColor = squares[i].style.backgroundColor
        const isBlank = squares[i].style.backgroundColor === 'white'
        
        const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
        if (notValid.includes(i)) continue
        
        if (rowForFour.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)){
          score += 4
          scoreDisplay.innerHTML = score
          rowForFour.forEach(index => {
            squares[index].style.backgroundColor = 'white'
            console.log("test")
          })
        }
      }
    }
    checkRowForFour()
    
    
     //check for column of Four
    function checkColumnForFour(){
      for (i = 0; i < 41; i++){
        let columnForFour = [i, i+width, i+width*2, i+width*3]
        let decidedColor = squares[i].style.backgroundColor
        const isBlank = squares[i].style.backgroundColor === 'white'
        
        if (columnForFour.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)){
          score += 4
          scoreDisplay.innerHTML = score
          columnForFour.forEach(index => {
            squares[index].style.backgroundColor = 'white'
            console.log("test")
          })
        }
      }
    }
    checkColumnForFour()
    
    
    //check for row of Three
    function checkRowForThree(){
      for (i = 0; i < 61; i++){
        let rowOfThree = [i, i+1, i+2]
        let decidedColor = squares[i].style.backgroundColor
        const isBlank = squares[i].style.backgroundColor === 'white'
        
        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
        if (notValid.includes(i)) continue
        
        if (rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)){
          score += 3
          scoreDisplay.innerHTML = score
          rowOfThree.forEach(index => {
            squares[index].style.backgroundColor = 'white'
            console.log("test")
          })
        }
      }
    }
    checkRowForThree()
    
    
     //check for column of Three
    function checkColumnForThree(){
      for (i = 0; i < 48; i++){
        let checkColumnForThree = [i, i+width, i+width*2]
        let decidedColor = squares[i].style.backgroundColor
        const isBlank = squares[i].style.backgroundColor === 'white'
        
        if (checkColumnForThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)){
          score += 3
          scoreDisplay.innerHTML = score
          checkColumnForThree.forEach(index => {
            squares[index].style.backgroundColor = 'white'
            console.log("test")
          })
        }
      }
    }
    checkColumnForThree()
    
    
    
    
    window.setInterval(function(){
      moveDown()
      checkRowForFive()
      checkRowForFour()
      checkColumnForFour()
      checkRowForThree()
      checkColumnForThree()
    }, 100)
  })
  
  
  // Current Version Without bugs (Compare to Original Version)
  
  // Original Version
  //https://www.youtube.com/watch?v=XD5sZWxwJUk&ab_channel=CodewithAniaKub%C3%B3w
  
  // Thanks to Anya Kubow!