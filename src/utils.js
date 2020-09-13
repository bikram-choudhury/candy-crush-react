export const boardWidth = 8;
const imgUrlPrefix = './assets/images';
export const candyImageUrls = [
  `${imgUrlPrefix}/blue-candy.png`,
  `${imgUrlPrefix}/green-candy.png`,
  `${imgUrlPrefix}/orange-candy.png`,
  `${imgUrlPrefix}/purple-candy.png`,
  `${imgUrlPrefix}/red-candy.png`,
  `${imgUrlPrefix}/yellow-candy.png`
];
export const mergeAndDeleteForRow = (candyBgImagesList, callback) => {
  for (let i = 0; i < (boardWidth * boardWidth) - 3; i++) {
    const rowOfThree = [i, i + 1, i + 2];
    const decidedCandyBgImg = candyBgImagesList[i];
    const isBlank = candyBgImagesList[i] === '';

    // check if all 3 candies are in same row
    const ceil = Math.ceil(i/boardWidth);
    const isDivisable = i%boardWidth === 0;
    const closestHeighestCandy = ceil*boardWidth;
    if(!isDivisable && i > (closestHeighestCandy - 3)) continue;

    const isSameCandies = rowOfThree.every(
      itIndex => candyBgImagesList[itIndex] === decidedCandyBgImg && !isBlank
    );

    if (isSameCandies) {
      rowOfThree.forEach(itIndex => {
        candyBgImagesList[itIndex] = '';
      });
      callback(candyBgImagesList);
    }
  }
};

export const mergeAndDeleteForColumn = (candyBgImagesList, callback) => {
  for (let i = 0; i <= (boardWidth * boardWidth) - boardWidth*2; i++) {
    const columnOfThree = [i, i + boardWidth, i + boardWidth*2];
    const decidedCandyBgImg = candyBgImagesList[i];
    const isBlank = candyBgImagesList[i] === '';

    const isSameCandies = columnOfThree.every(
      itIndex => candyBgImagesList[itIndex] === decidedCandyBgImg && !isBlank
    );

    if (isSameCandies) {
      columnOfThree.forEach(itIndex => {
        candyBgImagesList[itIndex] = '';
      });
      callback(candyBgImagesList);
    }
  }
};

export const moveDown = (candyBgImagesList, callback) => {
  for (let i = 0; i < (boardWidth*boardWidth)-boardWidth; i++) {
    const isBlank = candyBgImagesList[i+boardWidth] === '';
    if(isBlank) {
      candyBgImagesList[i+boardWidth] = candyBgImagesList[i];
      candyBgImagesList[i] = '';
    }
  }
  callback(candyBgImagesList);
};

export const generateCandyImgs = (candyBgImagesList, callback) => {
  for (let i = 0; i < boardWidth; i++) {
    if(candyBgImagesList[i] === '') {
      const randomImg = Math.floor(Math.random() * candyImageUrls.length);
      candyBgImagesList[i] = candyImageUrls[randomImg];
    }
  }
  callback(candyBgImagesList);
}
