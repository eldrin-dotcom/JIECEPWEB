document.addEventListener('DOMContentLoaded', function() {
            // Function to update navigation active states
            function updateNavActiveStates(currentPage) {
                // Desktop nav links
                document.querySelectorAll('#desktop-nav-links .nav-link').forEach(link => {
                    if (link.dataset.page === currentPage) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Bottom mobile nav links
                document.querySelectorAll('.bottom-navbar .nav-link').forEach(link => {
                    if (link.dataset.page === currentPage) {
                        link.classList.add('active-mobile');
                    } else {
                        link.classList.remove('active-mobile');
                    }
                });
            }

            // Set the current page identifier on the body and update nav states on load
            document.body.setAttribute('data-page', 'explore');
            updateNavActiveStates('explore');

            // Update active state when nav links are clicked (for demo purposes)
            document.querySelectorAll('.navbar-nav .nav-link, .bottom-navbar .nav-link').forEach(link => {
                link.addEventListener('click', function() {
                    const targetPage = this.dataset.page;
                    if (targetPage) {
                        // In a real application, this would involve routing or full page loads
                        // For this demo, we're just updating the active state
                        updateNavActiveStates(targetPage);
                    }
                });
            });
        });