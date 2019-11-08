function carousel() {
  // Init anim properties
  const zoomAnimDuration = 700; //ms 1s = 1000ms
  const slideAnimDuration = 700;
  const animNames = {
    unzoom: "unzoom",
    zoom: "zoom",
    slideIn: "slideIn",
    slideOut: "slideOut"
  };

  // Carousel states
  let isMoving = false;
  const slideHistory = [0];

  // Select DOM elements
  const board = document.getElementById("board");
  const cellContainer = document.getElementById("cell-container");

  const slides = Object.values(board.children); // Object => Array
  // Throw error if no slides
  if (slides.length === 0) throw new Error("Create at least one slide");

  ////////////////
  // NAVIGATION //
  ////////////////

  // Create one cell for each slide
  slides.forEach((slide, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    // Assign active class to default active cell
    if (index === 0) {
      cell.className = "cell" + " cell-active";
    }
    // Assign unique id
    cell.id = "cell" + index;
    // Assign event listeners
    cell.addEventListener("click", () => switchSlide(index));
    cell.addEventListener("touchstart", () => switchSlide(index));
    // Cells appends in DOM
    cellContainer.appendChild(cell);
  });

  // Select previous and next slide btn in DOM
  const prevBtn = document.getElementById("nav-btn-prev");
  const nextBtn = document.getElementById("nav-btn-next");

  prevBtn.addEventListener("click", () => previousSlide());
  prevBtn.addEventListener("touchstart", () => previousSlide());

  nextBtn.addEventListener("click", () => nextSlide());
  nextBtn.addEventListener("touchstart", () => nextSlide());

  // Display last slide
  function previousSlide() {
    const currentSlideIndex = slideHistory[slideHistory.length - 1];
    // If currentSlide is the first => display the last
    if (currentSlideIndex === 0) {
      switchSlide(slides.length - 1);
    }
    switchSlide(currentSlideIndex - 1);
  }

  // Display n+1 slide
  function nextSlide() {
    const currentSlideIndex = slideHistory[slideHistory.length - 1];
    // If currentSlide is the last => display the first
    if (currentSlideIndex === slides.length - 1) {
      switchSlide(0);
    } else switchSlide(currentSlideIndex + 1);
  }

  ///////////////////
  // ANIM FUNCTION //
  ///////////////////

  function switchSlide(nextSlideIndex) {
    // Check if carousel is not already moving
    if (isMoving) return;
    isMoving = true;

    // Check if next slide is not already displayed
    if (slideHistory[slideHistory.length - 1] === nextSlideIndex) return;

    // Reassign cell-active className and make active cell unclickable
    const cells = Object.values(cellContainer.children);
    cells.forEach(c => {
      if (cells.indexOf(c) === nextSlideIndex) {
        c.className = "cell" + " cell-active";
      } else {
        c.className = "cell";
      }
    });

    // Push nextSlideIndex in history
    slideHistory.push(nextSlideIndex);

    //////////////////
    // UNZOOM BOARD //
    //////////////////

    // Assign duration properties
    board.style.animationDuration = `${zoomAnimDuration}ms`;
    // Assign anim name => trigger anim
    board.style.animationName = animNames.unzoom;

    ///////////////////
    // SWITCH SLIDES //
    ///////////////////

    const previousSlide = slides[slideHistory[slideHistory.length - 2]];
    const nextSlide = slides[nextSlideIndex];

    // Assign duration properties
    previousSlide.style.animationDuration = `${slideAnimDuration}ms`;
    nextSlide.style.animationDuration = `${slideAnimDuration}ms`;

    // Wait until zoom anim ends
    setTimeout(() => {
      // Trigger slide anims
      previousSlide.style.animationName = animNames.slideOut;
      nextSlide.style.animationName = animNames.slideIn;
    }, zoomAnimDuration);

    ////////////////
    // ZOOM BOARD //
    ////////////////

    // Wait until switch anim end
    setTimeout(() => {
      board.style.animationName = animNames.zoom;
    }, parseInt(zoomAnimDuration) + parseInt(slideAnimDuration));

    ///////////
    // RESET //
    ///////////

    // Wait until all anim ends
    setTimeout(() => {
      isMoving = false;
    }, parseInt(slideAnimDuration) + parseInt(zoomAnimDuration) * 2);
  }
}

carousel();
