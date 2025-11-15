async function processData(visitorData) {
  try {
    const repoOwner = 'APSCPLM';
    const repoName = 'User-Data';
    const filePath = 'visitor_data.json';

    // Remove the token for now to test public access
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      let currentContent;
      try {
        currentContent = JSON.parse(atob(data.content));
      } catch (parseError) {
        console.warn('Error parsing current content, initializing empty array:', parseError);
        currentContent = [];
      }

      // Update existing entry or add new one
      const existingIndex = currentContent.findIndex(item => item.id === visitorData.id);
      if (existingIndex !== -1) {
        // Update existing entry
        currentContent[existingIndex] = {
          ...currentContent[existingIndex],
          ...visitorData,
          timestamp: visitorData.timestamp
        };
      } else {
        // Add new entry
        currentContent.push(visitorData);
      }

      // Encode the updated content
      const updatedContent = btoa(JSON.stringify(currentContent, null, 2));

      // Update the file on GitHub
      const updateResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update data for visitor ID: ${visitorData.id}`,
          content: updatedContent,
          sha: data.sha // Required for updating existing file
        }),
      });

      if (!updateResponse.ok) {
        const updateErrorBody = await updateResponse.text();
        console.error('Error updating file:', updateErrorBody);
        throw new Error(`Failed to update file: ${updateResponse.status}`);
      }

      console.log('Visitor data updated successfully');
    } else if (response.status === 404) {
      console.log('File not found. Creating new file.');
      const createResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Create visitor_data.json',
          content: btoa(JSON.stringify([])),  // Initialize with an empty array
        }),
      });

      if (!createResponse.ok) {
        const createErrorBody = await createResponse.text();
        console.error('Error creating file:', createErrorBody);
        throw new Error(`Failed to create file: ${createResponse.status}`);
      }
    } else {
      const errorBody = await response.text();
      console.error('Full error response:', errorBody);
      console.error('Response status:', response.status);
      console.error('Response headers:', JSON.stringify(Object.fromEntries(response.headers), null, 2));
      throw new Error(`Failed to fetch current file content: ${response.status}`);
    }

    // ... rest of the function
  } catch (error) {
    console.error('Error in processData:', error);
    console.error('Error details:', error.message);
  }
}