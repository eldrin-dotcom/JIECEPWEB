document.addEventListener('DOMContentLoaded', function() {
// Dummy Data for File Folders (for demonstration)
const folderFiles = {
    'general': [
        { title: 'General Physics Notes', type: 'PDF', size: '2.5MB', author: 'Dr. Evans' },
        { title: 'University Handbook 2023', type: 'PDF', size: '10MB', author: 'Admin' }
    ],
    'first-year': [
        { title: 'Intro to Eng. Syllabus', type: 'PDF', size: '500KB', author: 'Prof. Garcia' },
        { title: 'Basic Calculus Worksheets', type: 'DOCX', size: '1.2MB', author: 'Tutor Team' }
    ],
    'second-year': [
        { title: 'Circuit Theory Exam Review', type: 'PDF', size: '3MB', author: 'Prof. Lee' },
        { title: 'Data Structures Lab Manual', type: 'PDF', size: '1.8MB', author: 'Prof. Kim' }
    ],
    'third-year': [
        { title: 'Thermodynamics Lecture 1', type: 'PPTX', size: '4.5MB', author: 'Prof. Chen' },
        { title: 'Fluid Mechanics Problem Set', type: 'PDF', size: '900KB', author: 'Dr. Singh' }
    ],
    'fourth-year': [
        { title: 'Senior Design Project Guidelines', type: 'PDF', size: '2MB', author: 'Dept. Head' },
        { title: 'Capstone Thesis Template', type: 'DOCX', size: '1.5MB', author: 'Faculty of Eng.' }
    ]
};

const currentFolderTitle = document.getElementById('currentFolderTitle');
const folderItemsContainer = document.getElementById('folderItems');
const folderDropdownButton = document.getElementById('folderDropdownMenuButton');
const mobileFolderDropdown = document.getElementById('mobileFolderDropdown');

// Function to display files for a selected folder
function displayFolderContent(folderName) {
    const files = folderFiles[folderName];
    const folderDisplayName = folderName.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Files';
    currentFolderTitle.textContent = folderDisplayName;

    // Update dropdown button text
    if (folderDropdownButton) {
        folderDropdownButton.textContent = folderDisplayName;
    }

    folderItemsContainer.innerHTML = ''; // Clear previous content

    if (files && files.length > 0) {
        files.forEach(file => {
            const fileCard = document.createElement('div');
            fileCard.classList.add('col');
            fileCard.innerHTML = `
                <div class="book-card">
                    <div class="book-thumbnail">
                        <i class="fas fa-file-alt" style="font-size: 2.5rem; color: var(--medium-gray);"></i>
                    </div>
                    <div class="book-details">
                        <p class="book-title">${file.title}</p>
                        <p class="book-author">Author: ${file.author}</p>
                        <p class="book-category">Type: ${file.type} | Size: ${file.size}</p>
                    </div>
                </div>
            `;
            folderItemsContainer.appendChild(fileCard);
        });
    } else {
        folderItemsContainer.innerHTML = '<div class="col no-results">No files found in this folder.</div>';
    }
}

// Event listener for desktop grid folder cards
document.querySelectorAll('.folder-card').forEach(folderCard => {
    folderCard.addEventListener('click', function() {
        const folderName = this.dataset.folder;
        // Remove 'active-folder' class from all desktop folder cards
        document.querySelectorAll('.folder-card.active-folder').forEach(card => {
            card.classList.remove('active-folder');
        });
        // Add 'active-folder' class to the clicked desktop folder card
        this.classList.add('active-folder');
        displayFolderContent(folderName);
    });
});

// Event listener for mobile dropdown items
mobileFolderDropdown.querySelectorAll('.dropdown-item').forEach(dropdownItem => {
    dropdownItem.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        const folderName = this.dataset.folder;
        // Remove 'active' class from all dropdown items
        mobileFolderDropdown.querySelectorAll('.dropdown-item.active').forEach(item => {
            item.classList.remove('active');
        });
        // Add 'active' class to the clicked dropdown item
        this.classList.add('active');
        displayFolderContent(folderName);
    });
});

// Set initial content for the 'General Files' folder when the page loads
// This applies to both grid (if visible) and dropdown (if visible)
displayFolderContent('general');
const initialGeneralFolderCard = document.querySelector('.folder-card[data-folder="general"]');
if (initialGeneralFolderCard) {
    initialGeneralFolderCard.classList.add('active-folder');
}
const initialGeneralDropdownItem = mobileFolderDropdown.querySelector('.dropdown-item[data-folder="general"]');
if (initialGeneralDropdownItem) {
    initialGeneralDropdownItem.classList.add('active');
}


// Basic Search Functionality (Client-side, for demonstration)
const searchInput = document.getElementById('searchInput');
const searchCategory = document.getElementById('searchCategory');
const searchForm = document.querySelector('.search-bar form');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const query = searchInput.value.toLowerCase().trim();
    const category = searchCategory.value.toLowerCase();

    // Get all book cards across all tabs
    const allBooks = document.querySelectorAll('.book-card');

    allBooks.forEach(bookCard => {
        const title = bookCard.querySelector('.book-title').textContent.toLowerCase();
        const author = bookCard.querySelector('.book-author').textContent.toLowerCase();
        const bookCat = bookCard.querySelector('.book-category') ? bookCard.querySelector('.book-category').textContent.toLowerCase() : ''; // Handle files which might not have "Category: X"

        const matchesQuery = query === '' || title.includes(query) || author.includes(query) || bookCat.includes(query);
        const matchesCategory = category === '' || bookCat.includes(category);

        // Show/hide the parent column, not the card itself, to maintain grid/row structure
        if (matchesQuery && matchesCategory) {
            bookCard.parentElement.style.display = 'block';
        } else {
            bookCard.parentElement.style.display = 'none';
        }
    });

    // If searching in the 'Files' tab, hide the folder selection UI
    const filesTabButton = document.getElementById('files-tab');
    const folderDisplaySection = document.getElementById('folderContentDisplay');
    const fileFolderGrid = document.querySelector('.file-folder-grid');
    const folderDropdown = document.querySelector('.folder-dropdown');

    if (filesTabButton.classList.contains('active')) {
        if (query !== '') {
            folderDisplaySection.style.display = 'block'; // Ensure content area is visible for results
            fileFolderGrid.style.display = 'none'; // Hide grid
            folderDropdown.style.display = 'none'; // Hide dropdown
            currentFolderTitle.textContent = 'Search Results in Files'; // Update title for search results

            // Filter dummyFiles directly for 'Files' category search
            const filteredFiles = [];
            for (const folder in folderFiles) {
                folderFiles[folder].forEach(file => {
                    const fileTitle = file.title.toLowerCase();
                    const fileAuthor = file.author.toLowerCase();
                    if (fileTitle.includes(query) || fileAuthor.includes(query)) {
                        // Ensure no duplicates if a file exists in multiple conceptual "folders"
                        if (!filteredFiles.some(f => f.title === file.title && f.author === file.author)) {
                            filteredFiles.push(file);
                        }
                    }
                });
            }
            folderItemsContainer.innerHTML = '';
            if (filteredFiles.length > 0) {
                filteredFiles.forEach(file => {
                    const fileCard = document.createElement('div');
                    fileCard.classList.add('col');
                    fileCard.innerHTML = `
                        <div class="book-card">
                            <div class="book-thumbnail">
                                <i class="fas fa-file-alt" style="font-size: 2.5rem; color: var(--medium-gray);"></i>
                            </div>
                            <div class="book-details">
                                <p class="book-title">${file.title}</p>
                                <p class="book-author">Author: ${file.author}</p>
                                <p class="book-category">Type: ${file.type} | Size: ${file.size}</p>
                            </div>
                        </div>
                    `;
                    folderItemsContainer.appendChild(fileCard);
                });
            } else {
                folderItemsContainer.innerHTML = '<div class="col no-results">No files found matching your search.</div>';
            }

        } else {
            // If query is empty, revert to default folder display (General Files)
            displayFolderContent('general');
            fileFolderGrid.style.display = ''; // Show grid (handled by d-lg-grid/d-none)
            folderDropdown.style.display = ''; // Show dropdown (handled by d-lg-none/d-block)
            folderDisplaySection.style.display = 'block';
        }
    }

    // If searching, switch to the relevant tab if a category is selected
    if (category !== '') {
        const targetTabButton = document.querySelector(`#libraryTabs button[data-bs-target="#${category}"]`);
        if (targetTabButton) {
            const tab = new bootstrap.Tab(targetTabButton);
            tab.show();
        }
    }
});

// Handle tab switching to reset search or update display
const libraryTabs = document.getElementById('libraryTabs');
libraryTabs.addEventListener('shown.bs.tab', function (event) {
    const activeTabId = event.target.id;
    searchInput.value = ''; // Clear search input on tab change
    searchCategory.value = ''; // Clear search category on tab change

    // Reset display for all book cards and folder cards
    document.querySelectorAll('.book-card').forEach(card => card.parentElement.style.display = 'block');
    document.querySelectorAll('.folder-card').forEach(card => card.style.display = 'block');

    // If switching back to files tab without a query, ensure initial folder content is shown
    if (activeTabId === 'files-tab') {
        document.getElementById('folderContentDisplay').style.display = 'block';
        const isLargeScreen = window.innerWidth >= 992; // Bootstrap's lg breakpoint
        document.querySelector('.file-folder-grid').style.display = isLargeScreen ? 'grid' : 'none';
        document.querySelector('.folder-dropdown').style.display = isLargeScreen ? 'none' : 'block';

        displayFolderContent('general'); // Re-display General Files content
        // Ensure active folder card is highlighted if on desktop, or dropdown text is correct on mobile
        document.querySelectorAll('.folder-card').forEach(card => card.classList.remove('active-folder'));
        document.querySelector('.folder-card[data-folder="general"]').classList.add('active-folder');
        document.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('active'));
        document.querySelector('.dropdown-item[data-folder="general"]').classList.add('active');

    } else {
        document.getElementById('folderContentDisplay').style.display = 'none'; // Hide folder specific content if not on files tab
    }
});


// Handle switching between desktop and mobile nav active states
const desktopNavLinks = document.querySelectorAll('#desktop-nav-links .nav-link');
const bottomNavLinks = document.querySelectorAll('.bottom-navbar .nav-link');

function updateNavActiveStates() {
    const currentPage = document.body.dataset.page || 'library'; // Assuming this page is 'library'

    desktopNavLinks.forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    bottomNavLinks.forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active-mobile');
        } else {
            link.classList.remove('active-mobile');
        }
    });
}

// Set the current page identifier on the body
document.body.setAttribute('data-page', 'library');
updateNavActiveStates(); // Call on initial load

// Update active state when top nav links are clicked
desktopNavLinks.forEach(link => {
    link.addEventListener('click', function() {
        document.body.setAttribute('data-page', this.dataset.page);
        updateNavActiveStates();
    });
});

// Update active state when bottom nav links are clicked
bottomNavLinks.forEach(link => {
    link.addEventListener('click', function() {
        document.body.setAttribute('data-page', this.dataset.page);
        updateNavActiveStates();
    });
});

// Initial check for file tab display based on screen size
window.addEventListener('resize', () => {
    const filesTab = document.getElementById('files');
    const isFilesTabActive = filesTab && filesTab.classList.contains('active');
    if (isFilesTabActive) {
        const isLargeScreen = window.innerWidth >= 992;
        document.querySelector('.file-folder-grid').style.display = isLargeScreen ? 'grid' : 'none';
        document.querySelector('.folder-dropdown').style.display = isLargeScreen ? 'none' : 'block';
    }
});
// Also call on initial load for the files tab if it's the default active one
const filesTab = document.getElementById('files');
const filesTabButton = document.getElementById('files-tab');
if (filesTab && filesTabButton.classList.contains('active')) {
    const isLargeScreen = window.innerWidth >= 992;
    document.querySelector('.file-folder-grid').style.display = isLargeScreen ? 'grid' : 'none';
    document.querySelector('.folder-dropdown').style.display = isLargeScreen ? 'none' : 'block';
}
});