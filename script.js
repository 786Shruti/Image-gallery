const form = document.getElementById("imageForm");
const gallery = document.getElementById("gallery");
const fetchImagesButton = document.getElementById("fetchImages");

// Carousel elements
const carousel = document.getElementById("carousel");
const carouselImage = document.getElementById("carouselImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let currentCarouselIndex = 0;
let carouselImages = [];

async function getApiKey() {
    try {
        const response = await fetch('http://localhost/My_project/Image%20Gallery/getApiKey.php');
        
        // Check if the response is OK (200 status)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.apiKey; // Return the API key from the response
    } catch (error) {
        console.error('Error fetching API key:', error);
        alert('Error fetching API key!');
    }
}



// Load saved images from local storage
window.onload = function () {
    const savedImages = JSON.parse(localStorage.getItem("images")) || [];
    carouselImages = savedImages; // Set for carousel
    savedImages.forEach((imageUrl) => addImage(imageUrl));
};

// Add image to gallery
function addImage(url) {
    const div = document.createElement("div");
    div.classList.add("gallery-item");

    const img = document.createElement("img");
    img.src = url;
    img.alt = "Image";
    img.addEventListener("click", () => openCarousel(url));

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "x";
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteImage(url, div);
    });

    div.appendChild(img);
    div.appendChild(deleteBtn);
    gallery.appendChild(div);
}

// Delete image from gallery and local storage
function deleteImage(url, element) {
    gallery.removeChild(element);
    carouselImages = carouselImages.filter((img) => img !== url);
    const savedImages = JSON.parse(localStorage.getItem("images")) || [];
    const updatedImages = savedImages.filter((img) => img !== url);
    localStorage.setItem("images", JSON.stringify(updatedImages));
}

// Save image to local storage
function saveImageToLocal(url) {
    const savedImages = JSON.parse(localStorage.getItem("images")) || [];
    savedImages.push(url);
    localStorage.setItem("images", JSON.stringify(savedImages));
}

// Handle form submission for user-added images
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const imageUrl = document.getElementById("imageUrl").value.trim();
    if (imageUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
        addImage(imageUrl);
        saveImageToLocal(imageUrl);
        document.getElementById("imageUrl").value = "";
    } else {
        alert("Please enter a valid image URL ending in .jpeg, .jpg, .png, or .gif.");
    }
});

// Open carousel
function openCarousel(startImage) {
    currentCarouselIndex = carouselImages.indexOf(startImage);
    carouselImage.src = carouselImages[currentCarouselIndex];
    carousel.style.display = "flex"; // Use "flex" for centering
}

// Close carousel
carousel.addEventListener("click", () => {
    carousel.style.display = "none";
});

// Navigate carousel
prevBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    currentCarouselIndex = (currentCarouselIndex - 1 + carouselImages.length) % carouselImages.length;
    carouselImage.src = carouselImages[currentCarouselIndex];
});

nextBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
    carouselImage.src = carouselImages[currentCarouselIndex];
});

// Fetch images based on a keyword provided by the user
fetchImagesButton.addEventListener("click", async function () {
    const keyword = document.getElementById("keyword").value.trim();

    if (keyword === "") {
        alert("Please enter a search keyword.");
        return;
    }

    try {
        // Fetch API key dynamically
        const apiKey = await getApiKey();  // Fetch the key
        if (!apiKey) {
            alert("API Key could not be retrieved.");
            return;
        }

        // Make the request to Pixabay with the fetched API key
        const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${keyword}&per_page=10`);
        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
            data.hits.forEach((item) => {
                addImage(item.webformatURL);
                saveImageToLocal(item.webformatURL);
            });
        } else {
            alert("No images found for your search.");
        }
    } catch (error) {
        console.error("Error fetching images:", error);
    }
});

