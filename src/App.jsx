import {useState, useEffect} from 'react';
import { Toaster, toast } from "react-hot-toast";
import { FaEdit, FaTrash,FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

  const [selectedBook, setSelectedBook] = useState(null);

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
    setForm({title:"", author:"", rating:"", genre:"Fiction"});
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
  .filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (filter === "title") return a.title.localeCompare(b.title);
    if (filter === "rating") return b.rating - a.rating;
    return 0;
    });

  return(
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-center font-bold text-4xl text-orange-700 mb-6 tracking-wide">📚 Book-Library</h1>
      <motion.form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 space-y-4 border"
      initial={{opacity: 0, y: -20}}
      animate={{opacity: 1, y:0}}>
        <div>
        <label className="block font-semibold mb-1">Book Title</label>
        <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 outline-none"/>
        </div>
        <div>
        <label className="block font-semibold mb-1">Book Author</label>
        <input
        type="text"
        name="author"
        value={form.author}
        onChange={handleChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 outline-none"/></div>
        <div>
        <label className="block font-semibold mb-1">Book Genre</label>
        <select
        value={form.genre}
        onChange={(e)=>setForm({...form, genre: e.target.value })}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 outline-none">
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
        className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-200 outline-none"
        />
        </div>
        <button
        type="submit"
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">
        {editId !== null ? "Update Book" : "Add Book"}
        </button>
         <Toaster position="top-right" reverseOrder={false} />
        
      </motion.form>
      <div className="flex flex-col md:flex-row gap-4 my-6">
        <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-orange-300 outline-none"
        />
        <select
        value={filter}
        onChange={(e)=>setFilter(e.target.value)}
        className="p-2 border rounded focus:ring-2 focus:ring-orange-300 outline-none">
          <option value="">Sort</option>
          <option value="rating">Sort by Rating</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      <ul className="space-y-3">
        {filteredBooks.map((book,index) => (
          <li key={index} className="flex justify-between items-center p-3 border rounded shadow-sm bg-gray-50 hover:bg-gray-100 transition">
          <span>
            <span className="font-bold text-lg">{book.title}</span> by{" "}
            <span className="italic">{book.author}</span> <br/>
            <span className="text-sm text-gray-500">{book.genre} ⭐ {book.rating}
              </span>
            </span>

          <div className="space-x-2 flex">
            <button onClick={()=>setSelectedBook(book)} className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"><FaEye/></button>
            <button onClick={()=>handleEdit(index)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"><FaEdit/></button>
            <button onClick={()=> handleDelete(index)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"><FaTrash/></button>
          </div>
          </li>
        ))}
      </ul>

      {selectedBook &&(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-2">{selectedBook.title}</h2>
            <p>
              <strong>Author:</strong> {selectedBook.author}
              </p>
               <p>
              <strong>Genre:</strong> {selectedBook.genre}
            </p>
            <p>
              <strong>Rating:</strong> ⭐{selectedBook.rating}
            </p>

            <button onClick={() => setSelectedBook(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;