import React, { Component } from 'react';

import { getMovies } from './getMovies'; //getMovies file ko import kr rhe h --normal export m hm {} cruly braceces use krte h 
import axios from 'axios';  //promise based http client for the browser and node.js
export default class Movies extends Component {
    constructor(){
        super();  // super hme parent class ka this provide krta h 
        this.state ={
                movies : [] ,   // movies m getMovies JS ki file ki value put ki h  import kr k --- getMovies function ki trh aa rhi h to hmne use call ki h yhn pr 
                currSearchText : '' ,
                currPage : 1 ,
                genres : [{_id : 'abcd' , name : 'All Genres'}],
                currGenre : 'All Genres'
                // limit : 4 
            }
    }

async componentDidMount(){
    // console.log("componentDidMount"); 
    let res = await axios.get('https://backend-react-movie.herokuapp.com/movies');
    // console.log(res.data.movies);  
 
   let genreRes = await axios.get('https://backend-react-movie.herokuapp.com/genres');
  //  console.log(genreRes.data.genres); 

    // data mgane k lia hm get() method ka use krte h 
  // await krne vle h islia async bnaya
  // axios.get()  ek promise la kr k deti h  -- 2 ways for consume  (1st  then catch ) ,(2nd async await)
this.setState({
  movies : res.data.movies ,
  genres :  [...this.state.genres , ...genreRes.data.genres]
})
}


onDelete=(id)=>{
let narr = this.state.movies.filter(function(movieObj){
        return movieObj._id != id;
});
// console.log(narr);
 this.setState({
     movies : narr
 })
}


//jb hmne koi class bnai h to us class k ander ka this ki value (==) brabr  object hoti h 
//yhn pr arrow function ka this , class k this k brabr hoga
// arrow funtion bhr vlae this ko (parent vle this ko ) apna this bna leta h 

//   yhn pr handleChange function arrow function h -- to eska this class k sath bind h ab esko kese bhi call krne pr eska this fix rhega
//  --eska this class ko point kr rha hoga jo bhi eska input chlega 

handleChange=(e)=>{
    let val = e.target.value;
    // console.log(val); 
    this.setState({
        currSearchText : val
    })
}


  sortByStock=(e)=>{
    let classname = e.target.className; // className nikalne k lia
    let sortedMovies = []; 
      if( classname == 'fa fa-sort-asc'){ 
          //ascending order   ( a - b )
          // a - b  == ans 
          //  ans > 0 == > b before a 
          // ans <= 0 ===> no change 
          sortedMovies = this.state.movies.sort(function(movieobjA , movieobjB){
                return movieobjA.numberInStock - movieobjB.numberInStock
          });

          // sort() method sort the elements of an Array and return the sorted array

        }
        else{
          //desending order   (b - a)
          sortedMovies = this.state.movies.sort(function(movieobjA , movieobjB){
            return movieobjB.numberInStock - movieobjA.numberInStock
      });
        }

        this.setState({
          movies : sortedMovies
        })
  }

  
  sortByRating=(e)=>{
    let classname = e.target.className; // className nikalne k lia
    // console.log(classname); 
    let sortedMovies = []; 
      if( classname == 'fa fa-sort-asc'){ 
          //ascending order
          sortedMovies = this.state.movies.sort(function(movieobjA , movieobjB){
                return movieobjA.dailyRentalRate - movieobjB.dailyRentalRate
          });
        }
        else{
          //desending order
          sortedMovies = this.state.movies.sort(function(movieobjA , movieobjB){
            return movieobjB.dailyRentalRate - movieobjA.dailyRentalRate
      });
        }
        this.setState({
          movies : sortedMovies
        })
  }

  handlePageChange = (pageNumber)=>{
      this.setState({
        currPage : pageNumber
      });
  }

  handelGenreChange = (genre) =>{
    this.setState({
      currGenre : genre
    })
  }


  render() {
    // console.log("render");
        let {movies , currSearchText , currPage , genres ,currGenre } = this.state; //Destructing
        let fna = [];

        if(currSearchText == ''){
            fna = movies ;
        }
        else{
                fna = movies.filter(function(movieObj){
                    let title = movieObj.title.toLowerCase();
                    // console.log(title);
                    return title.includes(currSearchText.toLocaleLowerCase());
                })
        }


      if(currGenre != 'All Genres'){
        fna = fna.filter(function(movieObj){
            return movieObj.genre.name == currGenre
        })
      }



    let limit = 4;
    let si = (currPage - 1)* limit;
    let ei = si + limit ;

    let numberofpage = Math.ceil(fna.length/limit);
    let pageNumberArr = [];   // map function array pr apply hota h islia hme array banana pda

    for(let i = 0 ; i < numberofpage; i++){
      pageNumberArr.push(i+1);
    }

    fna = fna.slice(si , ei ); 
    //slice() method returns a shallow copy of a portion of an array into a new array object selected from start to end (end is not include)

  // if(fna.length ==0 && movies.length != 0){
  //   this.setState({
  //     currPage : 1  // current page ki sari value delete hone pr current page 1 pr chla jaega 
  //   })
  // }

    return (
        //JSX code only
      <>
      { this.state.movies.length == 0 ? <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div> :
    
    <div className='container'>
        <div className='row'>
            <div className='col-3'>
                 {/* <h3>hlo</h3> */}
      <ul className="list-group">             
            { 
              genres.map((genreObj)=>(
                <li onClick={ ()=> this.handelGenreChange(genreObj.name)} key={genreObj._id} className="list-group-item">
                  {genreObj.name}
                </li>
              ))
            }
               {/* html code ko hm () or round brackets or parenthese  m likhenge   */}
               {/* JSX , map , filter  , condition operator , JavaScript code ko hm {} / curly brackets m likhenge   */}
      </ul>
        <h3> Current Genre : {currGenre}</h3>

          </div>
            <div className='col-9'>
                  
            <input type='search' value={this.state.currSearchText} onChange={this.handleChange}></input> 
            {/* yhn pr hm handleChange function ki defination pass kr rhe h --eska this class ko point kr rha hoga jo bhi eska input chlega  */}
                  
            <table className="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Title</th>
      <th scope="col">Genre</th>
      <th scope="col">
        <i className="fa fa-sort-asc" aria-hidden="true" onClick={this.sortByStock}></i>
          Stock
        <i className="fa fa-sort-desc" aria-hidden="true" onClick={this.sortByStock}></i>
          </th>
      <th scope="col">
        <i className="fa fa-sort-asc" aria-hidden="true" onClick={this.sortByRating}></i>
          Rate
        <i className="fa fa-sort-desc" aria-hidden="true" onClick={this.sortByRating}></i>
          </th>
      <th scope="col">Delete</th>
    </tr>
  </thead>
  <tbody>
        {
            fna.map((moviesObj)=>{
                return(
                    <tr scope='row' key = {moviesObj._id}>
                         <td></td>
                         <td>{moviesObj.title}</td>
                         <td>{moviesObj.genre.name}</td>
                         <td>{moviesObj.numberInStock}</td>
                         <td>{moviesObj.dailyRentalRate}</td>
                         <td><button type="button" className="btn btn-danger" onClick={function(){this.onDelete(moviesObj._id)}.bind(this)}>Delete</button></td>
                         {/* yhn pr hm onDelete function ko call kr rhe h  */}
                         {/* yhn botton k upr this ko call kr rhe h  */}
                         {/* onDelete function 1 arrow function h to arrow function ka this fix hota h  */}
                         {/* agr hm yhn bind nhi kraege to ese pta hi nhi hoga ki this.onDelete() h kya/ kon sa h  --ese defination nhi milega */}

                    </tr>
                )
            })
        }
  </tbody>
                </table>
<nav aria-label="...">
  <ul className='pagination'>
    { pageNumberArr.map((pageNumber)=>{
        let classStyle = pageNumber == currPage ? 'page-item active' : 'page-item';
        return(
          <li key={pageNumber} className={classStyle} onClick={()=>this.handlePageChange(pageNumber)}>
            <span className='page-link' >{pageNumber}</span>
          </li>
        )
    })}
  </ul>
</nav>
            </div>
        </div>
    </div>
  } </>
    )
  }
}
