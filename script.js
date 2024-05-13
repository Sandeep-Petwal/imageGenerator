// const apiKey = "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";
const apiKey =    "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"; // my api tocken

const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

let isImageGenerating = false;

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//function to handle falled operation
function failed() {
  imageGallery.innerHTML = '<div class="img-card"><img src="images/img-1.jpg" alt="image"></div><div class="img-card"><img src="images/img-2.jpg" alt="image"></div><div class="img-card"><img src="images/img-3.jpg" alt="image"></div><div class="img-card"><img src="images/img-4.jpg" alt="image"></div><div class="img-card"><img src="images/img-5.jpg" alt="image"></div><div class="img-card"><img src="images/img-6.jpg" alt="image"></div><div class="img-card"><img src="images/img-7.jpg" alt="image"></div><div class="img-card"><img src="images/img-8.jpg" alt="image"></div>';
  isImageGenerating = false;
  alert("Failed to generate image!");
}

//making a download function
const load = (url, name) => {
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

const generateImage = async (promptt, number_img) => {
  isImageGenerating = true;


  for (let i = 0; i < number_img; i++) {
    // Generate a random number between 1 and 10000 and append it to the prompt
    const randomNumber = getRandomNumber(1, 10000);

    const prompt = `${promptt} ${randomNumber}`;
    // We added random number to prompt to create different results
    const response = await fetch(
      "https://api-inference.huggingface.co/models/prompthero/openjourney",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );


    if (!response.ok) {
      failed();
      return
    }

    const blob = await response.blob();
    let imgUrl = URL.createObjectURL(blob);


    let image_src = imgUrl;
    let image_name = `${prompt}_${i}`;

    //following code will run for every image
    console.log(imgUrl);
    let img = document.querySelector(`.generated_img_${i + 1}`);
    img.src = imgUrl;
    let parent = img.parentElement;

    // adding download button to each image_card
    let btn = document.createElement("button");
    btn.classList.add("download");

    //adding onclick listner to  download button
    let onclickValue = `load("${image_src}", "${image_name}")`;
    btn.setAttribute("onclick", onclickValue);
    btn.innerHTML = '<img src="images/download.svg" alt="download_icon" >';
    parent.appendChild(btn);
  }

  // creating a fake semulation
  // for (let i = 1; i <= number_img; i++) {
  //   await new Promise((resolve) => {
  //     setTimeout(() => {

  //       let image_src = `images/img-${i}.jpg`;
  //       let image_name = `${prompt}_${i}`;

  //       //following code will run for every image
  //       let img = document.querySelector(`.generated_img_${i}`);
  //       img.src = image_src;
  //       let parent = img.parentElement;

  //       // adding download button to each image_card
  //       let btn = document.createElement("button");
  //       btn.classList.add("download");

  //       //adding onclick listner to  download button
  //       let onclickValue = `load("${image_src}", "${image_name}")`;
  //       btn.setAttribute("onclick", onclickValue);
  //       btn.innerHTML = '<img src="images/download.svg" alt="download_icon" >';
  //       parent.appendChild(btn);

  //       resolve();
  //     }, 1000);
  //   });
  // }
  isImageGenerating = false;
};

const handleImageGeneration = (e) => {
  e.preventDefault();
  if (isImageGenerating) {
    return;
  }

  //clearing the pre appended images and adding loading icon according the number of images
  imageGallery.innerHTML = "";

  //getting number of image and the prompt
  let number_img = document.getElementsByClassName("img-quantity")[0].value;
  let prompt = document.querySelector(".prompt-input").value;

  for (let i = 0; i < number_img; i++) {
    //creating image
    let img = document.createElement("img");
    img.src = "images/loading.gif";
    img.setAttribute("alt", `image_${i + 1}_of_${prompt}`);
    img.classList.add(`generated_img_${i + 1}`);

    //creating image card
    let div = document.createElement("div");
    div.classList.add("img-card");
    div.appendChild(img);


    imageGallery.appendChild(div);
  }

  //calling generate function
  generateImage(prompt, number_img);
};

generateForm.addEventListener("submit", handleImageGeneration);

//prompt suggestion 
let suggest = document.getElementById("suggest");
suggest.addEventListener("click", () => {
  document.querySelector(".prompt-input").value = (imagePrompts[`${getRandomNumber(1, 19)}`]);
});

// const updateImageCard = (imgDataArray) => {
//   imgDataArray.forEach((imgObject, index) => {
//     const imgCard = imageGallery.querySelectorAll(".img-card")[index];
//     const imgElement = imgCard.querySelector("img");
//     const downloadBtn = imgCard.querySelector(".download-btn");

//     // Set the image source to the AI-generated image data
//     const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
//     imgElement.src = aiGeneratedImage;

//     // When the image is loaded, remove the loading class and set download attributes
//     imgElement.onload = () => {
//       imgCard.classList.remove("loading");
//       downloadBtn.setAttribute("href", aiGeneratedImage);
//       downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
//     }
//   });
// }

// const generateAiImages = async (userPrompt, userImgQuantity) => {
//   try {
//     // Send a request to the OpenAI API to generate images based on user inputs
//     const response = await fetch("https://api.openai.com/v1/images/generations", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         prompt: userPrompt,
//         n: userImgQuantity,
//         size: "512x512",
//         response_format: "b64_json"
//       }),
//     });

//     // Throw an error message if the API response is unsuccessful
//     if(!response.ok) throw new Error("Failed to generate AI images. Make sure your API key is valid.");

//     const { data } = await response.json(); // Get data from the response
//     updateImageCard([...data]);
//   } catch (error) {
//     alert(error.message);
//   } finally {
//     generateBtn.removeAttribute("disabled");
//     generateBtn.innerText = "Generate";
//     isImageGenerating = false;
//   }
// }

// const handleImageGeneration = (e) => {
//   e.preventDefault();
//   if(isImageGenerating) return;

//   // Get user input and image quantity values
//   const userPrompt = e.srcElement[0].value;
//   const userImgQuantity = parseInt(e.srcElement[1].value);

//   // Disable the generate button, update its text, and set the flag
//   generateBtn.setAttribute("disabled", true);
//   generateBtn.innerText = "Generating";
//   isImageGenerating = true;

//   // Creating HTML markup for image cards with loading state
//   const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
//       `<div class="img-card loading">
//         <img src="images/loader.svg" alt="AI generated image">
//         <a class="download-btn" href="#">
//           <img src="images/download.svg" alt="download icon">
//         </a>
//       </div>`
//   ).join("");

//   imageGallery.innerHTML = imgCardMarkup;
//   generateAiImages(userPrompt, userImgQuantity);
// }

// generateForm.addEventListener("submit", handleImageGeneration);
const imagePrompts = [
  "A serene sunset over a calm lake",
  "An abandoned spaceship in a futuristic city",
  "A mystical forest with glowing plants",
  "A bustling market in a foreign city",
  "A robot repairing itself in a dark workshop",
  "A fantasy castle perched on a mountaintop",
  "Giant whales swimming in a neon-lit ocean",
  "A magical library with floating books",
  "A cozy cottage covered in snow",
  "A steampunk cityscape with airships",
  "A group of adventurers exploring a mysterious cave",
  "A vibrant underwater coral reef",
  "A futuristic city skyline at night",
  "A majestic dragon soaring through the clouds",
  "A tranquil garden with cherry blossoms",
  "An alien landscape with strange rock formations",
  "A high-tech laboratory filled with glowing equipment",
  "A spooky haunted house on a foggy night",
  "A spaceship navigating through asteroid fields",
  "A surreal desert landscape with floating islands",
  "Casting a Spell, by Reylia Slaby and Alena Aenami"
];

