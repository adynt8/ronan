let similarImagesContainer = null;

async function fetchSimilarImages(query) {
    const newImages = await fetchNewImages(query);
    const additionalImages = await fetchAdditionalImages(query);
    const combinedImages = [...newImages, ...additionalImages];
    displayImages(combinedImages);
}

async function fetchNewImages(query) {
    // Fetch new images logic
    // ...
}

async function fetchAdditionalImages(query) {
    // Fetch additional images logic (e.g., from another API or local storage)
    // ...
}

function displayImages(images) {
    // Display images logic
    // ...
}

function fetchSimilarImages(erectLength, unit) {
    console.log('Starting fetchSimilarImages function');
    console.log(`Erect Length: ${erectLength} ${unit}`);

    // Remove existing similar images container if it exists
    if (similarImagesContainer) {
        console.log('Removing existing similar images container');
        similarImagesContainer.remove();
    }

    // Create and display loading container
    similarImagesContainer = document.createElement('div');
    similarImagesContainer.className = 'result-box';
    similarImagesContainer.style.display = 'flex';
    similarImagesContainer.style.flexDirection = 'column';
    similarImagesContainer.style.alignItems = 'center';
    similarImagesContainer.style.justifyContent = 'center';
    similarImagesContainer.style.minHeight = '200px';

    const loadingText = document.createElement('p');
    loadingText.textContent = 'Searching for similar images...';
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';

    similarImagesContainer.appendChild(loadingText);
    similarImagesContainer.appendChild(loadingSpinner);

    // Insert the loading container after the pornstar comparison section
    const pornstarComparison = document.getElementById('pornstar-comparison');
    pornstarComparison.parentNode.insertBefore(similarImagesContainer, pornstarComparison.nextSibling);

    // Convert length to inches and cm
    const lengthInInches = unit === 'cm' ? erectLength / 2.54 : erectLength;
    const lengthInCm = unit === 'in' ? erectLength * 2.54 : erectLength;
    console.log(`Length in inches: ${lengthInInches.toFixed(2)}, Length in cm: ${lengthInCm.toFixed(2)}`);
    
    // Define a range for similar sizes (e.g., +/- 0.5 inches and +/- 1.27 cm)
    const minLengthInches = lengthInInches - 0.5;
    const maxLengthInches = lengthInInches + 0.5;
    const minLengthCm = lengthInCm - 1.27;
    const maxLengthCm = lengthInCm + 1.27;
    console.log(`Search range: ${minLengthInches.toFixed(2)}" - ${maxLengthInches.toFixed(2)}" / ${minLengthCm.toFixed(2)}cm - ${maxLengthCm.toFixed(2)}cm`);

    // List of subreddits to search
    const subreddits = ['penis', 'measuredpenis', 'MassiveCock', 'averagepenis', 'hugecockclub', 'cock'];
    console.log('Subreddits to search:', subreddits);

    // Check if we have cached results with the same measurements
    const cachedResults = localStorage.getItem('similarImages');
    if (cachedResults) {
        const { timestamp, posts, cachedLength, cachedUnit } = JSON.parse(cachedResults);
        const now = new Date().getTime();
        // If the cache is less than 1 hour old and measurements are the same, use it
        if (now - timestamp < 3600000 && cachedLength === erectLength && cachedUnit === unit) {
            console.log('Using cached results');
            displayResults(posts);
            return;
        }
    }

    // Function to fetch and process posts from a subreddit
    function fetchFromSubreddit(subreddit) {
        console.log(`Fetching top posts from r/${subreddit} for the last month`);
        return fetch(`https://www.reddit.com/r/${subreddit}.json?limit=100&t=month`)
            .then(response => response.json())
            .then(data => {
                console.log(`Received ${data.data.children.length} top posts from r/${subreddit}`);
                const filteredPosts = data.data.children.filter(post => {
                    const title = post.data.title.toLowerCase();
                    const inchMatch = title.match(/(\d+(\.\d+)?)\s*(inch|in|")/);
                    const cmMatch = title.match(/(\d+(\.\d+)?)\s*(cm|centimeter)/);
                    if (inchMatch) {
                        const postSize = parseFloat(inchMatch[1]);
                        return postSize >= minLengthInches && postSize <= maxLengthInches;
                    } else if (cmMatch) {
                        const postSize = parseFloat(cmMatch[1]);
                        return postSize >= minLengthCm && postSize <= maxLengthCm;
                    }
                    return false;
                });
                return { posts: filteredPosts };
            });
    }

    // Function to search subreddits sequentially
    async function searchSubreddits() {
        console.log('Starting subreddit search');
        let allSimilarPosts = [];
        for (const subreddit of subreddits) {
            console.log(`Searching r/${subreddit}`);
            let totalPosts = 0;
            while (totalPosts < 300) {
                const { posts } = await fetchFromSubreddit(subreddit);
                allSimilarPosts = allSimilarPosts.concat(posts);
                totalPosts += 100;
                if (posts.length < 100) break;
            }
            if (allSimilarPosts.length >= 5) {
                break;
            }
        }
        console.log(`Total similar posts found: ${allSimilarPosts.length}`);
        return allSimilarPosts;
    }

    // Search subreddits and display results
    searchSubreddits().then(similarPosts => {
        console.log(`Total similar posts found: ${similarPosts.length}`);
        // Cache the results with current measurements
        localStorage.setItem('similarImages', JSON.stringify({
            timestamp: new Date().getTime(),
            posts: similarPosts,
            cachedLength: erectLength,
            cachedUnit: unit
        }));
        displayResults(similarPosts);
    })
    .catch(error => {
        console.error('Error fetching similar images:', error);
        similarImagesContainer.innerHTML = '';
        const errorText = document.createElement('p');
        errorText.textContent = `An error occurred while fetching similar images. Search parameters: ${minLengthInches.toFixed(2)}" - ${maxLengthInches.toFixed(2)}" / ${minLengthCm.toFixed(2)}cm - ${maxLengthCm.toFixed(2)}cm`;
        similarImagesContainer.appendChild(errorText);
    });
}

function displayResults(similarPosts) {
    // Clear the loading content
    similarImagesContainer.innerHTML = '';
    similarImagesContainer.style.display = 'flex';
    similarImagesContainer.style.flexWrap = 'wrap';
    similarImagesContainer.style.justifyContent = 'center';
    similarImagesContainer.style.gap = '10px';

    const heading = document.createElement('h3');
    heading.textContent = 'Similar Sizes from Reddit (NSFW):';
    heading.style.width = '100%';
    heading.style.marginBottom = '10px';
    heading.style.textAlign = 'center';
    similarImagesContainer.appendChild(heading);

    if (similarPosts.length === 0) {
        const noImagesText = document.createElement('p');
        noImagesText.textContent = `No similar images found.`;
        similarImagesContainer.appendChild(noImagesText);
    } else {
        const imageContainer = document.createElement('div');
        imageContainer.style.display = 'flex';
        imageContainer.style.flexWrap = 'wrap';
        imageContainer.style.justifyContent = 'center';
        imageContainer.style.gap = '10px';
        similarImagesContainer.appendChild(imageContainer);

        const usedSubreddits = new Set();
        similarPosts.forEach((post, index) => {
            if (usedSubreddits.size >= 5 || index >= 5) return;
            if (usedSubreddits.has(post.data.subreddit)) return;

            console.log(`Processing post ${index + 1}`);
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.style.width = '200px';
            imgContainer.style.height = '240px';
            imgContainer.style.borderRadius = '10px';
            imgContainer.style.overflow = 'hidden';

            const img = document.createElement('img');
            img.src = post.data.url;
            img.alt = 'Similar size image (NSFW)';
            img.style.width = '100%';
            img.style.height = '200px';
            img.style.objectFit = 'cover';
            img.style.filter = 'blur(10px)';
            img.style.transition = 'filter 0.3s';

            // Add error handling for image loading
            img.onerror = function() {
                console.log(`Image ${index + 1} failed to load`);
                imgContainer.style.display = 'none'; // Hide the container if image fails to load
            };

            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '200px';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.color = 'white';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.opacity = '1';
            overlay.style.transition = 'opacity 0.3s';
            overlay.textContent = 'NSFW - Hover to unblur';

            const sizeInfo = document.createElement('div');
            sizeInfo.style.height = '40px';
            sizeInfo.style.display = 'flex';
            sizeInfo.style.alignItems = 'center';
            sizeInfo.style.justifyContent = 'center';
            sizeInfo.style.backgroundColor = '#f0f0f0';
            sizeInfo.style.color = '#333';
            sizeInfo.style.fontSize = '14px';
            sizeInfo.textContent = `${post.data.title.match(/(\d+(\.\d+)?)\s*(inch|in|"|cm|centimeter)/)[0]}`;

            const username = document.createElement('div');
            username.style.position = 'absolute';
            username.style.bottom = '40px';
            username.style.left = '0';
            username.style.width = '100%';
            username.style.padding = '5px';
            username.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            username.style.color = 'white';
            username.style.fontSize = '12px';
            username.style.textAlign = 'center';
            username.textContent = `u/${post.data.author}`;

            imgContainer.appendChild(img);
            imgContainer.appendChild(overlay);
            imgContainer.appendChild(sizeInfo);
            imgContainer.appendChild(username);
            imageContainer.appendChild(imgContainer);

            const unblurImage = () => {
                if (img.style.filter === 'blur(10px)') {
                    console.log(`Unblurring image ${index + 1}`);
                    img.style.filter = 'blur(0)';
                    overlay.style.opacity = '0';
                }
            };

            const blurImage = () => {
                if (img.style.filter === 'blur(0px)') {
                    console.log(`Blurring image ${index + 1}`);
                    img.style.filter = 'blur(10px)';
                    overlay.style.opacity = '1';
                }
            };

            const expandImage = () => {
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.zIndex = '1000';
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.3s ease-in-out';

                const fullImg = document.createElement('img');
                fullImg.src = post.data.url;
                fullImg.style.maxWidth = '90%';
                fullImg.style.maxHeight = '90%';
                fullImg.style.objectFit = 'contain';
                fullImg.style.transform = 'scale(0.9)';
                fullImg.style.transition = 'transform 0.3s ease-in-out';

                modal.appendChild(fullImg);
                document.body.appendChild(modal);

                // Trigger reflow
                modal.offsetHeight;

                // Start animation
                modal.style.opacity = '1';
                fullImg.style.transform = 'scale(1)';

                modal.addEventListener('click', () => {
                    // Start closing animation
                    modal.style.opacity = '0';
                    fullImg.style.transform = 'scale(0.9)';

                    // Remove modal after animation
                    setTimeout(() => {
                        document.body.removeChild(modal);
                    }, 300);
                });
            };

            imgContainer.addEventListener('mouseenter', unblurImage);
            imgContainer.addEventListener('mouseleave', blurImage);
            imgContainer.addEventListener('click', expandImage);
            usedSubreddits.add(post.data.subreddit);
        });
    }
}