import {useState, useEffect} from 'react';
import { Toaster, toast } from "react-hot-toast";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

function App(){
  const [books,setBooks]= useState(()=>{
  const saved = localStorage.getItem("books");
  return saved ? JSON.parse(saved):[];
  });

  const [form,setForm]=useState(
    {title:"",
      author:"",
      rating:"",
      genre: "Fiction",
    }
  )

  const[editId, setEditId]=useState(null);

  const [search,setSearch]=useState("");
  const [filter,setFilter]=useState("");

  useEffect(()=> {
    localStorage.setItem("books",JSON.stringify(books));
  },[books]);

  const handleSubmit=(e)=>{
      e.preventDefault();
      if (!form.title || !form.author) {
      toast.error("Title & Author required");
      return;
    }
    if(editId!==null){
      const updated=[...books];
      updated[editId]=form;
      setBooks(updated);
      setEditId(null);
    }else{
      setBooks([...books, form]);
    }
    setForm({title:"", author:"", rating:""});
  };

  const handleEdit = (index) => {
    setForm(books[index]);
    setEditId(index);
  };

  const handleDelete=(index)=>{
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((_, id)=>id !== index));
      toast.success("Book deleted!");
    }
  };

  const handleChange=(e)=>{
    setForm({ ...form,[e.target.name]: e.target.value });
  };
  
  const filteredBooks = books
  .filter(b =>
    [b.title, b.author].some(field => field.toLowerCase().includes(search.toLowerCase())
    )
  )
  .sort((a, b) =>
    filter === "title"
      ? a.title.localeCompare(b.title)
      : filter === "rating"
      ? b.rating - a.rating
      : 0
  );

  return(
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-center font-bold text-3xl text-orange-700 mb-6">Book-Library</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4 border">
        <div>
        <label className="block font-semibold mb-1">Book Title</label>
        <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"/>
        </div>
        <div>
        <label className="block font-semibold mb-1">Book Author</label>
        <input
        type="text"
        name="author"
        value={form.author}
        onChange={handleChange}
        className="w-full p-2 border rounded"/></div>
        <div>
        <label className="block font-semibold mb-1">Book Genre</label>
        <select
        value={form.genre}
        onChange={(e)=>setForm({...form, genre: e.target.value })}
        className="w-full p-2 border rounded">
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Sci-Fi">Sci-Fi</option>
        </select>
        </div>
        <div>
        <label className="block font-semibold mb-1">Rating</label>
        <input
        type="number"
        name="rating"
        value={form.rating}
        onChange={handleChange}
        placeholder="Rating (1-5)"
        className="w-full p-2 border rounded"
        /></div>
        <button
        type="submit"
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">
        {editId !== null ? "Update Book" : "Add Book"}
        </button>
         <Toaster position="top-right" reverseOrder={false} />
        
      </form>

      <div className="flex flex-col md:flex-row gap-4 my-6">
        <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="flex-1 p-2 border rounded"
        />
        <select
        value={filter}
        onChange={(e)=>setFilter(e.target.value)}
        className="p-2 border rounded">
          <option value="">Sort</option>
          <option value="rating">Sort by Rating</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      <ul className="space-y-3">
        {filteredBooks.map((book,index) => (
          <li key={index} className="flex justify-between items-center p-3 border rounded shadow-sm bg-gray-50">
          <span>
            <span className="font-bold">{book.title}</span> by{" "}
            <span className="italic">{book.author}</span> ({book.genre}) ⭐{book.rating}</span>

          <div className="space-x-2">
            <button onClick={()=>handleEdit(index)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"><FaEdit/></button>
            <button onClick={()=> handleDelete(index)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"><FaTrash/></button>
          </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default App;