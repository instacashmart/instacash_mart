const deviceQuestions = {
  calls: {
    label: "Calls working",
    question: "Are you able to make and receive calls?",
    hint: "Check your device for cellular network connectivity issues.",
  },
  powerOn: {
    label: "Powers on & works",
    question: "Does your device switch on and work properly?",
    hint: "Check that it boots up and runs without restarting or freezing.",
  },
  touch: {
    label: "Touch screen working",
    question: "Is your device's touch screen working properly?",
    hint: "Check the touch screen functionality of your device.",
  },
  originalScreen: {
    label: "Original screen",
    question: "Is your device's screen original?",
    hint: "Choose Yes if it was never changed or changed by an authorised service centre.",
  },
  display: {
    label: "Display without lines/spots",
    question: "Is the display free of lines, dead pixels and spots?",
    hint: "Open a plain white screen and look for marks or discoloration.",
  },
  keyboard: {
    label: "Keyboard & trackpad working",
    question: "Are the keyboard and trackpad working properly?",
    hint: "Check every key and the trackpad click and scrolling.",
  },
  battery: {
    label: "Battery holds charge",
    question: "Does the battery charge and hold its charge normally?",
    hint: "Check it charges with the charger and lasts a normal day of use.",
  },
  sound: {
    label: "Sound from both sides",
    question: "Do both earbuds play sound clearly?",
    hint: "Play music and check the left and right earbuds separately.",
  },
  caseCharging: {
    label: "Case charges earbuds",
    question: "Does the charging case charge the earbuds?",
    hint: "Put the earbuds in the case and check they start charging.",
  },
  controller: {
    label: "Controller working",
    question: "Is the controller working properly?",
    hint: "Check all buttons, triggers and joysticks for drift or faults.",
  },
  discDrive: {
    label: "Games load properly",
    question: "Do games and the disc drive (if any) load properly?",
    hint: "Start a game and check it loads without errors.",
  },
  lens: {
    label: "Lens clean, no fungus",
    question: "Is the lens free of scratches, fungus and haze?",
    hint: "Look through the lens against light to check for marks.",
  },
  shutter: {
    label: "Shutter & autofocus working",
    question: "Are the shutter and autofocus working properly?",
    hint: "Take a few photos and check focus and shutter release.",
  },
  warranty: {
    label: "Under warranty",
    question: "Is your device under manufacturer warranty?",
    hint: "A valid bill can help you get a better price.",
  },
  gstBill: {
    label: "GST bill with same IMEI/serial",
    question: "Do you have a GST valid bill with the same IMEI / serial number?",
    hint: "Make sure your bill has the device IMEI or serial number mentioned on it.",
  },
};

const categoryQuestions = {
  phone: ["calls", "touch", "originalScreen", "warranty", "gstBill"],
  tablet: ["powerOn", "touch", "originalScreen", "warranty", "gstBill"],
  laptop: ["powerOn", "display", "keyboard", "warranty", "gstBill"],
  smartwatch: ["powerOn", "touch", "battery", "warranty", "gstBill"],
  earbuds: ["sound", "caseCharging", "battery", "warranty", "gstBill"],
  console: ["powerOn", "controller", "discDrive", "warranty", "gstBill"],
  camera: ["powerOn", "lens", "shutter", "warranty", "gstBill"],
};

const toQuestion = (t) => ({
  key: t,
  ...deviceQuestions[t],
});

export const questionsFor = (t) =>
  (categoryQuestions[t] || ["powerOn", "warranty", "gstBill"]).map(toQuestion);

export const allQuestions = Object.keys(deviceQuestions).map(toQuestion);

export const SELL_STEPS = 4;
