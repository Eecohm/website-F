import fs from 'fs';

let c = fs.readFileSync('src/data/content.js', 'utf8');
let i = 0;

// Replace programs images
const programImages = [
  '/images/Images/adhm.webp',
  '/images/Images/dhm.webp',
  '/images/Images/program_1.webp',
  '/images/Images/hmimgs.webp',
  '/images/Images/cs.webp',
  '/images/Images/preschool.webp'
];

let progIndex = 0;
c = c.replace(/image: "\.webp"/g, () => {
  if (progIndex < programImages.length) {
    return `image: "${programImages[progIndex++]}"`;
  }
  return `image: ".webp"`;
});

// Replace facilities images (12 of them)
let facIndex = 1;
c = c.replace(/image: "\.webp"/g, () => {
  if (facIndex <= 12) {
    return `image: "/images/F/${facIndex++}.webp"`;
  }
  return `image: ".webp"`;
});

// Replace team images
const teamImages = [
  'aalok', 'bibek', 'sumans', 'sumanu', 'pramila', 'nirmal', 'janardhan', 'pritam'
];
let teamIndex = 0;
c = c.replace(/image: "\.webp"/g, () => {
  if (teamIndex < teamImages.length) {
    return `image: "/images/Images/${teamImages[teamIndex++]}.webp"`;
  }
  return `image: ".webp"`;
});

// Replace testimonials images
const testImages = [
  'CHOUHAN', 'arpanksharma', 'sadikshya', 'sandhya'
];
let testIndex = 0;
c = c.replace(/image: "\.webp"/g, () => {
  if (testIndex < testImages.length) {
    return `image: "/images/Images/${testImages[testIndex++]}.webp"`;
  }
  return `image: ".webp"`;
});

fs.writeFileSync('src/data/content.js', c);
console.log('Fixed content.js');
