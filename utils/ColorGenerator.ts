

const RandomGeneratorHexColor = () : string => {
  
   const usedColors = new Set(); // To keep track of used colors
   let color;

   do {
     // Generate a random hex color code
     color = "#" + Math.floor(Math.random() * 16777215).toString(16);
   } while (usedColors.has(color)); // Repeat until a new color is generated

   usedColors.add(color); // Add the new color to the set of used colors

   return color;

}




export default RandomGeneratorHexColor;