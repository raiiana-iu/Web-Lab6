import { useEffect, useReducer, useState } from "react";
import { fetchPosts } from "./api/postsApi.js";
import FilterForm from "./components/FilterForm.jsx";
import PostList from "./components/PostList.jsx";
import postsReducer, {
  initialState
} from "./reducer/postsReducer.js";

function App(){
  const[state,dispatch]=useReducer(
    postsReducer,
    initialState
  );

  const[filter,setFilter]=useState("");

  useEffect(() =>{
    let ignore=false;

    async function loadPosts(){
      dispatch({ type:"FETCH_START"});

      try {
        const posts=await fetchPosts();

        if(!ignore){
          dispatch({
            type:"FETCH_SUCCESS",
            payload:posts
          });
        }
      }catch(error){
        if(!ignore){
          dispatch({
            type:"FETCH_ERROR",
            payload:error.message
          });
        }
      }
    }
    loadPosts();
    return ()=>{
      ignore=true;
    };
  },[]);

  const filteredPosts=state.posts.filter((post)=>
    post.title
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  return(
    <main>
      <h1>Post Dashboard</h1>

      <FilterForm
        filter={filter}
        onFilterChange={setFilter}
      />

      {state.loading&&<p>Loading posts...</p>}

      {state.error&&(
        <p role="alert">Error:{state.error}</p>
      )}

      {!state.loading &&
        !state.error &&
        state.posts.length===0 &&(
          <p>No posts found.</p>
        )}

      {!state.loading &&
        !state.error &&
        state.posts.length>0&&(
          <>
            {filteredPosts.length===0 ? (
              <p>No posts found.</p>
            ) : (
              <PostList posts={filteredPosts} />
            )}
          </>
        )}
    </main>
  );
}

export default App;
