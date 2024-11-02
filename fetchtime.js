function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  function updateLastCommitDate() {
    const username = 'ChromaPIE';
    const repo = 'chromic-pc-collection ';
    const branch = 'overlord';
  
    fetch(`https://api.github.com/repos/${username}/${repo}/branches/${branch}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('GitHub API request failed');
        }
        return response.json();
      })
      .then(data => {
        const lastCommitDate = data.commit.commit.author.date;
        document.getElementById('last-updated').textContent = formatDate(lastCommitDate);
      })
      .catch(error => {
        console.error('Error fetching last commit date:', error);
        if (typeof site !== 'undefined' && site.github && site.github.build_revision) {
          const buildDate = new Date(parseInt(site.github.build_revision) * 1000);
          document.getElementById('last-updated').textContent = formatDate(buildDate);
        } else {
          document.getElementById('last-updated').textContent = 'Unable to fetch update time';
        }
      });
  }
  
  window.onload = updateLastCommitDate;
