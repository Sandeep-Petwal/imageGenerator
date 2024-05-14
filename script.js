// const apiKey = "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";
const apiKey = "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"; // my api tocken
// const apiKey =    "hf_pnqnOZbndoIXBirbivAgnytJtIYi"; // wrong api tocken

const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");
const title = document.querySelector("title");
let alrt = document.querySelector(".alert");

let isImageGenerating = false;

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//function to handle falled operation
function failed() {
  imageGallery.innerHTML = '<div class="img-card"><img src="images/img-1.jpg" alt="image"></div><div class="img-card"><img src="images/img-2.jpg" alt="image"></div><div class="img-card"><img src="images/img-3.jpg" alt="image"></div><div class="img-card"><img src="images/img-4.jpg" alt="image"></div><div class="img-card"><img src="images/img-5.jpg" alt="image"></div><div class="img-card"><img src="images/img-6.jpg" alt="image"></div><div class="img-card"><img src="images/img-7.jpg" alt="image"></div><div class="img-card"><img src="images/img-8.jpg" alt="image"></div>';
  isImageGenerating = false;
  title.innerHTML = "Try again !"
  // alert("Failed to generate image!");
  // alert
  alrt.style.display = "block";
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

let count = 2;

const generateImage = async (promptt, number_img) => {
  isImageGenerating = true;

  // failed();

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
    title.innerHTML = "AI Image Generator"

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
  // count++;
  // if(count%2 == 0){
  //   failed();
  //   return
  // }
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

  //removing alert if any
  alrt.style.display = "none";

  //clearing the pre appended images and adding loading icon according the number of images
  imageGallery.innerHTML = "";

  //getting number of image and the prompt
  let number_img = document.getElementsByClassName("img-quantity")[0].value;
  let prompt = document.querySelector(".prompt-input").value;

  for (let i = 0; i < number_img; i++) {
    //creating image
    title.innerHTML = "Loading..."
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
  document.querySelector(".prompt-input").value = (imagePrompts[`${getRandomNumber(1, 40)}`]);
});

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
  "Casting a Spell, by Reylia Slaby and Alena Aenami",
  "A tranquil sunset over a peaceful lake",
  "A dense, mystical forest with sunlight filtering through the trees",
  "A majestic mountain peak covered in snow",
  "A serene beach with crystal-clear turquoise water",
  "A vibrant field of wildflowers under a blue sky",
  "A waterfall cascading down into a lush green valley",
  "A colorful sunset sky painted with hues of orange and pink",
  "A starry night sky above a silhouetted forest",
  "A playful group of dolphins swimming in the ocean",
  "A curious fox exploring a snowy landscape",
  "A graceful deer standing in a misty meadow",
  "A family of elephants walking across the savannah",
  "A flock of colorful birds perched on tree branches",
  "An intricate mandala design with vibrant colors",
  "A surreal landscape with floating geometric shapes",
  "An artist's studio filled with paintbrushes and canvases",
  "A street art mural depicting abstract shapes and colors",
  "A sculpture garden with modern art installations",
  "A whimsical garden filled with imaginative sculptures",
  "A city skyline transformed by colorful graffiti art"
];

