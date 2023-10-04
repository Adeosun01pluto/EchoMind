// Results.js
import axios from 'axios';
import  { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../../../constants/constant';
import Feed from '../feeds/Feed';
import Following from '../followings/Following';
import User from '../users/User';
import { ThreeDots } from 'react-loader-spinner';

const Results = () => {
    // let search
    const [searchParams,setSearchParams] = useSearchParams()
    const search = searchParams.get("q")
    const type = searchParams.get("types")
    const author = searchParams.get("authors")
    const time = searchParams.get("time")
      // Define your query function for fetching search results
  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/search?query=${search}&type=${type || "all" }&author=${author}&time=${time}`);
      return response.data; // Adjust the response structure as needed
    } catch (error) {
      throw new Error('Failed to fetch search results');
    }
  };
    // Define your query function using React Query
  const { data: searchResults, refetch,isLoading } = useQuery(
    ['searchResults', search, type, author, time], // Query key
    fetchSearchResults, // Query function
    {
    //   enabled: false, // Disable the query by default
    }
  );

  // Use the search to perform search operations or fetch data
  useEffect(() => {
    // You can trigger a query using React Query here
    refetch(); // Replace with your actual query function
  }, [searchParams]);
  const filters = [
    {
        title : "types",
        types: [
        {value:"all", label: "All types", },
        {value:"questions", label: "Questions", },
        {value:"answers", label: "Answers", },
        {value:"posts", label: "Posts", },
        {value:"profiles", label: "Profiles", },
        {value:"orbits", label: "Orbits", },
        {value:"spaces", label: "Spaces", }
    ]
    },
    {
        title: "authors",
        types : [
            {value:"all people", label: "All people", },
            {value:"people you know", label: "People you follow", },
        ]
    },
    {
        title: "time",
        types : [

            {value:"all", label: "All time", },
            {value:"hours", label: "Past hour", },
            {value:"day", label: "Past day", },
            {value:"week", label: "Past week", },
            {value:"month", label: "Past month", },
            {value:"year", label: "Past year", },
        ]
    }
  ];

  const handleSearchTypes = (filterTitle, value) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    // Update the search parameter based on the filter title and value
    updatedSearchParams.set(filterTitle, value);
    // Update the route with the modified search parameters
    setSearchParams(updatedSearchParams);
  };
  
  if(isLoading){
    return <div className="w-full items-center justify-center flex">
            <ThreeDots 
            height="80" 
            width="50" 
            radius="9"
            color="gray" 
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
            />
        </div>
  }
  return (
    <div className='w-full dark:text-[#f2e4fb]  min-h-screen text-[#060109] gap-2 md:gap-4  mx-auto p-2 md:p-4 flex flex-col md:flex-row'>
        {/* Side bar */}
        <div className="md:w-3/12 h-full hidden md:block">
            <div className='flex flex-col w-[90%] items-center'>
                <div className='w-[60%] self-end'>
                    <ul className='flex flex-col gap-2 py-4'>
                        {filters.map((filter, idx)=>(
                            <div key={idx}>
                                <p className='font-semibold py-3 '>By {filter.title}</p>
                                {filter.types.map((type, idx)=>(
                                    <div className='cursor-pointer my-1 rounded-sm text-sm bg-slate-400 px-2 py-1' key={idx} onClick={() => handleSearchTypes(filter.title.toLowerCase(), type.value)} >{type.label}</div>
                                ))}
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Main */}
        <div className="md:w-5/12 w-full dark:bg-[#060109] bg-white">
          {
            searchResults?.length > 0 ? (
              searchResults.map((result, idx) => (
                <div key={idx}>
                  {/* Check if result has a 'username' property */}
                  {result.username && <User user={result} />}

                  {/* Check if result has a 'content' property */}
                  {result?.content && <Feed refetch={refetch} post={result} />}

                  {/* Check if result has a 'name' property */}
                  {result?.name && <Following following={result} />}
                </div>
              ))
            ) : (
              <p>No results found</p>
            )
          }
        </div>

    </div>
  );
};

export default Results;
