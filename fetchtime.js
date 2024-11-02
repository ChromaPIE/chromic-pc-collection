function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  function updateLastCommitDate() {
    const username = 'ChromaPIE';
    const repo = 'chromic-pc-collection';
    const branch = 'overlord';
  
    fetch(`https://api.github.com/repos/${username}/${repo}/branches/${branch}`)
      .then(response => response.json())
      .then(data => {
        const lastCommitDate = data.commit.commit.author.date;
        document.getElementById('last-updated').textContent = formatDate(lastCommitDate);
      })
      .catch(error => {
        console.error('Error fetching last commit date:', error);
        document.getElementById('last-updated').textContent = '(Failed to fetch update time)';
      });
  }
  
  // Call the function when the page loads
  window.onload = updateLastCommitDate;
  