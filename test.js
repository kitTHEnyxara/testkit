let nameColorChangingActive = false;

function NameColorChanger() {
  if (!nameColorChangingActive) return; // Stop the process if nameColorChangingActive is false

  setTimeout(() => {
    if (nameColorChangingActive) {
      // Get the current color from the rainbowColors array
      const newColor = rainbowColors[currentColorIndex];

      // Change the player's name color
      Player.LabelColor = newColor;
    ServerAccountUpdate.QueueData({ LabelColor: Player.LabelColor });

      // Move to the next color in the rainbow
      currentColorIndex = (currentColorIndex + 1) % rainbowColors.length;

      // Schedule the next call
      NameColorChanger();
    }
  }, 1001);
}

function toggleNameColorChanger() {
  nameColorChangingActive = !nameColorChangingActive; // Toggle the state

  if (nameColorChangingActive) {
    NameColorChanger(); // Start the color changing process
  }

  // Log current status to console
  console.log(`Name color changer ${nameColorChangingActive ? 'ON' : 'OFF'}`);
}

// Integrate the toggleNameColorChanger function within the Preference screen for testing
function PreferenceLoad() {
  // Existing code for loading preferences...

  // Call the name color changer toggle function for demonstration
  toggleNameColorChanger();
}

// You can call toggleNameColorChanger() from anywhere in your code to start/stop the name color changer.


// Get the target's appearance assets
var appearanceAssets = Player.Appearance;

// Initialize the hair color variable
var hairColor = null;

// Loop through the appearance assets
for (var i = 0; i < appearanceAssets.length; i++) {
  // Check if the asset is a hair asset
  if (appearanceAssets[i].Asset.Group.Name == 'HairFront' || appearanceAssets[i].Asset.Group.Name == 'HairBack') {
    // Get the color of the hair asset
    hairColor = appearanceAssets[i].Color;
    // If the color is not a string, assume it's an array and take the first value
    if (!(typeof hairColor === 'string')) {
      hairColor = hairColor[0];
    }
    // Break out of the loop since we found the hair color
    break;
  }
}

// If no hair color was found, set it to a default value
if (!hairColor) {
  hairColor = "default";
}

// Output the hair color to the console
console.log("Target's hair color: " + hairColor);

// Save the hair color as a value
Player.hairColor = hairColor;

function CharacterToggleVisibility(Player) {
  let script = InventoryGet(Player, "ItemScript");
  let mode;
  if (!script) {
    mode = "bodyOnly";
    script = InventoryWear(Player, "Script", "ItemScript");
  } else if (!script.Property.Hide.includes("Cloth") && !script.Property.Hide.includes("HairFront") && !script.Property.Hide.includes("HairBack") && !script.Property.Hide.includes("HairAccessory1") && !script.Property.Hide.includes("HairAccessory2")) {
    mode = "hairAndBodyInvisClothesVisible";
  } else if (!script.Property.Hide.includes("Cloth")) {
    mode = "all";
  } else {
    mode = "visible";
  }
  script.Property = script.Property || {};
  if (mode === "bodyOnly") {
    script.Property.Hide = AssetGroup
      .filter(g => g.Category === "Appearance" && !g.Clothing && !["Height", "Emoticon", "Pronouns"]
      .includes(g.Name)).map(g => g.Name);
  } else if (mode === "hairAndBodyInvisClothesVisible") {
    script.Property.Hide = AssetGroup
      .filter(g => g.Category === "Appearance" && !g.Clothing)
      .map(g => g.Name);
  } else if (mode === "all") {
    script.Property.Hide = AssetGroup.map(g => g.Name).filter(gn => gn !== "ItemScript");
  } else {
    InventoryRemove(Player, "ItemScript", true);
  }

  CharacterScriptRefresh(Player);
}

// Function to create a 500x500 2D array of functions
function createFunctionArray(size) {
  let array = [];
  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      // Initialize with a default function
      row.push(function() { console.log(`Default function at (${i},${j})`); });
    }
    array.push(row);
  }
  return array;
}

// Initialize the 2D array of functions
const SIZE = 500;
let funcArray = createFunctionArray(SIZE);

// Function to call a function from the 2D array
function callFunction(x, y) {
  if (x < SIZE && y < SIZE) {
    funcArray[x][y]();
  } else {
    console.log('Invalid coordinates');
  }
}

// Function to save a custom function at specified coordinates in the 2D array
function saveFunction(x, y, func) {
  if (x < SIZE && y < SIZE && typeof func === 'function') {
    funcArray[x][y] = func;
  } else {
    console.log('Invalid coordinates or function');
  }
}

// Example custom functions
let rainbowColors = [
  '#FF0000', '#ff0900', '#ff1200', '#ff1b00', '#ff2400',
  '#ff2d00', '#ff3600', '#ff4000', '#ff4900', '#ff5200',
  '#ff5b00', '#ff6400', '#ff6d00', '#ff7600', '#FF7F00',
  '#ff8800', '#ff9100', '#ff9a00', '#ffa400', '#ffad00',
  '#ffb600', '#ffbf00', '#ffc800', '#ffd100', '#ffda00',
  '#ffe400', '#ffed00', '#fff600', '#FFFF00', '#edff00',
  '#dbff00', '#c8ff00', '#b6ff00', '#a4ff00', '#92ff00',
  '#80ff00', '#6dff00', '#5bff00', '#49ff00', '#37ff00',
  '#24ff00', '#12ff00', '#00FF00', '#00ed12', '#00db24',
  '#00c837', '#00b649', '#00a45b', '#00926d', '#008080',
  '#006d92', '#005ba4', '#0049b6', '#0037c8', '#0024db',
  '#0012ed', '#0000FF', '#0500f6', '#0b00ed', '#1000e4',
  '#1500db', '#1b00d2', '#2000c9', '#2600c1', '#2b00b8',
  '#3000af', '#3600a6', '#3b009d', '#400094', '#46008b',
  '#4B0082', '#50008b', '#540094', '#59009d', '#5d00a6',
  '#6200af', '#6600b8', '#6b00c1', '#7000c9', '#7400d2',
  '#7900db', '#7d00e4', '#8200ed', '#8600f6', '#8B00FF',
  '#9800e3', '#a500c6', '#b200aa', '#bf008e', '#cb0071',
  '#d80055', '#e50039', '#f2001c'
];

let currentColorIndex = 0;
let colorChangingActive = false;
let toggle = false;
let originalHairColor = null; // Store the original hair color
let changeRestraints = false; // Toggle for changing restraints color

// Color changer for hair and accessories
function ColorChanger(RandomColor) {
  if (!colorChangingActive) return;

  setTimeout(() => {
    if (colorChangingActive) {
      const newColor = rainbowColors[currentColorIndex];
      const hairAccessory2 = InventoryGet(Player, "HairAccessory2");
      const hairBack = InventoryGet(Player, "HairBack");
      const hairFront = InventoryGet(Player, "HairFront");
      const tailStraps = InventoryGet(Player, "TailStraps");
      const suit = InventoryGet(Player, "Suit");
      const suitLower = InventoryGet(Player, "SuitLower");

      if (hairAccessory2) hairAccessory2.Color = newColor;
      if (hairBack) hairBack.Color = newColor;
      if (hairFront) hairFront.Color = newColor;
      if (tailStraps) tailStraps.Color = newColor;
      if (suitLower) suitLower.Color = newColor;
      if (suit) suit.Color = newColor;

      if (changeRestraints) {
        for (let E = Player.Appearance.length - 1; E >= 0; E--) {
          const item = Player.Appearance[E];
          if (item && (
            item.Asset.IsRestraint || 
            ["ItemNeck", "ItemVulva", "ItemVulvaPiercings", "ItemButt", 
             "ItemPelvis", "ItemTorso","ItemTorso2","ItemNipples", "ItemBreast"].includes(item.Asset.Group.Name)
          )) {
            item.Color = newColor;
          }
        }
      }

      ColorChanger2(newColor);
      currentColorIndex = (currentColorIndex + 1) % rainbowColors.length;
      ColorChanger(newColor);
    } else {
      resetHairColor();
    }
  }, 1001);
}
function ColorChanger2(RandomColor) {
  // Update the eyes with the same color as the outfit
  const eyes = InventoryGet(Player, "Eyes");
  const eyes2 = InventoryGet(Player, "Eyes2");

  if (eyes) eyes.Color = RandomColor;
  if (eyes2) eyes2.Color = RandomColor;

  // Update the player's character in the chat room
  ChatRoomCharacterUpdate(Player);
}

function toggleColorChanger() {
  if (!toggle) {
    // Start the color changing process
    startColorChanger();
  } else {
    // Stop the color changing process and reset hair color to original
    stopColorChanger();
  }
  toggle = !toggle; // Toggle the state

  // Log current status to console
  console.log(`Color changer ${toggle ? 'ON' : 'OFF'}`);
}

function startColorChanger() {
  if (!colorChangingActive) {
    colorChangingActive = true;
    originalHairColor = Player.hairColor; // Store the original hair color
    ColorChanger(rainbowColors[currentColorIndex]); // Initial call to start the color changing process
  }
}

function stopColorChanger() {
  colorChangingActive = false;
  resetHairColor(); // Reset hair color to original when stopping the process
}

function resetHairColor() {
  // Reset hair color to original
  const hairAccessory2 = InventoryGet(Player, "HairAccessory2");
  const hairBack = InventoryGet(Player, "HairBack");
  const hairFront = InventoryGet(Player, "HairFront");
  const tailStraps = InventoryGet(Player, "TailStraps");
  const suit = InventoryGet(Player, "Suit");
  const suitLower = InventoryGet(Player, "SuitLower");

  if (hairAccessory2) hairAccessory2.Color = originalHairColor;
  if (hairBack) hairBack.Color = originalHairColor;
  if (hairFront) hairFront.Color = originalHairColor;
  if (tailStraps) tailStraps.Color = originalHairColor;
  if (suitLower) suitLower.Color = originalHairColor;
  if (suit) suit.Color = originalHairColor;

  // Update the player's character in the chat room
  ChatRoomCharacterUpdate(Player);
}

function toggleRestraintsColor() {
  changeRestraints = !changeRestraints;
  console.log(`Restraints color change ${changeRestraints ? 'ON' : 'OFF'}`);
}

function customFunc1() {
  toggleColorChanger(); // Call this function to toggle the color changing process
}

function customFunc2() {
  CharacterToggleVisibility(Player);
}

function customFunc3() {
  toggleRestraintsColor(); // Call this function to toggle restraints color change
}
function customFunc4(){
toggleNameColorChanger();
}

// Save custom functions into the array
saveFunction(1, 0, customFunc2);
saveFunction(0, 0, customFunc1);
saveFunction(0, 1, customFunc3);
saveFunction(1, 1, customFunc4);


//callFunction(0,0); color changer toggle
//callFunction(1,0); invisibility toggle 3 step
//callFunction(0,1); color changer restraints toggle
//callFunction(1,1); color changer name toggle
