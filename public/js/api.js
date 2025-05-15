(function(){

   const baseURL = 'http://localhost:8080';

   async function testAPIs(){
    // test list first
    let testId = '';
    let testJSON = {};
    try{
        // list
        let list = await callAPI('GET', '/api/blog', null, null)
        console.log('\n\n**************\nlist results:');
        console.log(list);
        

        // Create form data object
        let input = document.querySelector('input[type="file"]')
        let data = new FormData()
        data.append('image', input.files[0]);
        data.append('postTitle', 'My API Test Title');
        data.append('postContent','Post content test');
        data.append('imgDescription','Image description test');
        

        // create
        let newBlogPost = await callAPI(
          'POST', 
          '/api/blog', 
          null, 
          data
        )
        blogPostId = newBlogPost._id;
        console.log('\n\n***************\ncreate results:');
        console.log(newBlogPost);
        

        // find
        let retrievedNewBlogPost = await callAPI(
          'GET',
          `/api/blog/post/${newBlogPost._id}`, 
          null, 
          null
        )
        console.log('\n\n**************\nfind results:');
        console.log(retrievedNewBlogPost);


        // update imgDescription
        retrievedNewBlogPost.imgDescription += ' appended by the AJAX API ';
        let updatedBlogPost = await callAPI(
          'PUT',
          `/api/blog/post/${retrievedNewBlogPost._id}`, 
          null, 
          retrievedNewBlogPost
        )
        console.log('\n\n*************\nupdate results:');
        console.log(updatedBlogPost);
        

        // now find again to confirm that the imgDescription was changed
        let retrievedUpdatedBlogPost = await callAPI(
          'GET',
          `/api/blog/post/${updatedBlogPost._id}`, 
          null, 
          null
        )
        console.log('\n\n*************\nfind results (should contain updated description field):');
        console.log(retrievedUpdatedBlogPost);


        // delete
        let deletedBlogPost = await callAPI(
          'DELETE', 
          `/api/blog/post/${retrievedUpdatedBlogPost._id}`, 
          null, 
          null
        )
        console.log(deletedBlogPost);
    
    } catch(err) {
        console.error(err);
    };
  }//end testAPIs



  async function callAPI(method, uri, params, body){
    jsonMimeType = {
      'Content-type':'application/json'
    }

    try {
      const response = await fetch(baseURL + uri, {
        method: method, // GET, POST, PUT, DELETE, etc.
        ...(method=='POST' ? {body: body} : {}),
        ...(method=='PUT' ?  {headers: jsonMimeType, body:JSON.stringify(body)} : {})
      });
      return response.json(); 

    } catch(err) {
      console.error(err);
      return "{'status':'error'}";
    }
  }
      

  // Calls our test function when we click the button
  // afer validating that there's a file selected.
  document.querySelector('#testme').addEventListener("click", ()=>{
    let input = document.querySelector('input[type="file"]')
    if (input.value) { 
      testAPIs();
    } else {
      alert("Please select an image file first.");
    }
  });
})();
