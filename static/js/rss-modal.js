document.addEventListener('DOMContentLoaded', function() {
    const modalHTML = `
        <div id="rss-modal" class="modal">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2>Subscribe to RSS</h2>
                <p>Choose which feed you'd like to subscribe to:</p>
                <a href="/tags/essay/index.xml" class="feed-option">
                    <strong>Essays Only</strong><br>
                    <small>Deep dives, opinions, and analysis</small>
                </a>
                <a href="/tags/build/index.xml" class="feed-option">
                    <strong>Builds Only</strong><br>
                    <small>Projects and technical implementations</small>
                </a>
                <a href="/index.xml" class="feed-option">
                    <strong>Everything</strong><br>
                    <small>All posts and updates</small>
                </a>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const btn = document.getElementById('rss-btn');
    const modal = document.getElementById('rss-modal');
    const closeBtn = document.querySelector('.modal-close');

    if (btn) {
        btn.onclick = function() {
            modal.style.display = 'block';
        }
    }

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
