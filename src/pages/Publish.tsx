import React = require('react');
import { useParams } from 'react-router-dom';
import { Product, productConverter } from '../classes/Product';
import { db, storage, te } from '../firebase';
import { v4 } from 'uuid';

export const Publish = () => {
  const params = useParams();
  const [input, setInput] = React.useState(new Product());
  const photoRef = React.useRef(null);

  function submit(e) {
    let today = new Date();
    var productId = v4();
    console.log(productId, 'productId');
    e.preventDefault();
    input.publisherId = params.id;
    console.warn(photoRef.current.files);
    // manageImageUpload(photoRef.current.files);
    console.warn('input:', input);
    for (const file of photoRef.current.files) {
      const imageId = file.name + v4();
      const imageRef = storage.ref(
        `${today.getFullYear()}/${params.id}/${productId}/${imageId}`
      );
      imageRef.put(file);
    }
    db.collection('products')
      .withConverter(productConverter)
      .doc(productId)
      .set(input)
      .then((res) => alert('Added: ' + input.name));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name == 'category') {
      setInput((prevInput) => ({
        ...prevInput,
        category: value.split(','),
      }));
    } else {
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));
    }
  }
  return (
    <>
      <div className="">
        <form
          className="px-4 my-32 max-w-3xl mx-auto space-y-6"
          onSubmit={(e) => submit(e)}
        >
          <h1 className="text-3xl font-semibold text-white">
            Pubblica un prodotto
          </h1>
          <div>
            <label className="text-gray-200">Nome:</label>
            <input
              className="border border-gray-400 text-white block py-2 px-4 w-full rounded focus:outline-none focus:border-teal-500"
              type="text"
              name="name"
              value={input.name}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <label className="text-gray-200">Descrizione: </label>
            <textarea
              className="border border-gray-400 text-white block py-2 px-4 w-full rounded focus:outline-none focus:border-teal-500"
              name="description"
              value={input.description}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="grid grid-cols-2 justify-between">
            <div className="flex flex-col w-2/3">
              <label className="text-gray-200">Quantità: </label>
              <input
                className="border border-gray-400 text-white block py-2 px-4 w-full rounded focus:outline-none focus:border-teal-500"
                type="number"
                min="0"
                name="quantity"
                value={input.quantity}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="flex flex-col w-2/3">
              <label className="text-gray-200">Prezzo unitario: </label>
              <div className="flex">
                <div className="flex items-center px-4 bg-blue-900 rounded-l">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-8 h-8 text-gray-500 bg-transparent"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.798 7.45c.512-.67 1.135-.95 1.702-.95s1.19.28 1.702.95a.75.75 0 001.192-.91C12.637 5.55 11.596 5 10.5 5s-2.137.55-2.894 1.54A5.205 5.205 0 006.83 8H5.75a.75.75 0 000 1.5h.77a6.333 6.333 0 000 1h-.77a.75.75 0 000 1.5h1.08c.183.528.442 1.023.776 1.46.757.99 1.798 1.54 2.894 1.54s2.137-.55 2.894-1.54a.75.75 0 00-1.192-.91c-.512.67-1.135.95-1.702.95s-1.19-.28-1.702-.95a3.505 3.505 0 01-.343-.55h1.795a.75.75 0 000-1.5H8.026a4.835 4.835 0 010-1h2.224a.75.75 0 000-1.5H8.455c.098-.195.212-.38.343-.55z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  className="border border-gray-400 block py-2 px-4 w-full rounded-r text-white focus:outline-none focus:border-teal-500"
                  type="number"
                  name="price"
                  min="0"
                  value={input.price}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-gray-200">Categorie: </label>
            <input
              className="border border-gray-400 text-white block py-2 px-4 w-full rounded focus:outline-none focus:border-teal-500"
              type="text"
              name="category"
              value={input.category}
              onChange={(e) => handleChange(e)}
            />
            <label className="text-gray-600 text-sm">
              Separare le categorie con virgole, ad esempio: cibo,ortaggi,...
            </label>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-400 dark:text-white"
              htmlFor="file_input"
            >
              Carica foto:
            </label>
            <input
              className="block w-full text-sm border border-gray-300 rounded-lg file:mx cursor-pointer text-gray-600 focus:outline-none p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              id="file_input"
              type="file"
              name="photos"
              accept="image/png, image/jpg, image/jpeg"
              multiple
              ref={photoRef}
            />
          </div>
          <div className="flex max-w-3xl justify-center">
            <button
              type="submit"
              className="border drop-shadow-[#106ae0] drop-shadow-lg border-gray-200 text-white rounded py-2 px-5 hover:shadow-lg hover:shadow-cyan-500/50 hover:border-teal-500"
            >
              Inserisci Prodotto
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
