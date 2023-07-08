import React = require('react');
import { useParams } from 'react-router-dom';
import { Product, productConverter } from '../classes/Product';
import { db, storage } from '../firebase';
import { v4 } from 'uuid';

export const Publish = () => {
  const params = useParams();
  const [input, setInput] = React.useState(new Product());
  var productId = v4();
  function submit(e) {
    e.preventDefault();
    console.log(input);
    input.publisherId = params.id;
    db.collection('products')
      .withConverter(productConverter)
      .doc(productId)
      .set(input)
      .then((res) => alert('Added: ' + input.name));
  }

  function manageImageUpload(files: FileList) {
    let today = new Date();
    for (const file of files) {
      storage.ref(`${today.getFullYear}/${params.id}/`);
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name == 'category') {
      setInput((prevInput) => ({
        ...prevInput,
        category: value.split(','),
      }));
    } else if (name == 'photos') {
      let photoURLs = input.photoURLs;
      manageImageUpload(files);
      photoURLs.push(':)');
      setInput((prevInput) => ({
        ...prevInput,
        photoURLs: photoURLs,
      }));
      console.warn(input);
    } else {
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));
    }
  }
  return (
    <>
      <h1>Publish products</h1>
      <form onSubmit={(e) => submit(e)}>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={input.name}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label>
          Descrizione:
          <input
            type="text"
            name="description"
            value={input.description}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label>
          Quantità:
          <input
            type="number"
            name="quantity"
            value={input.quantity}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label>
          Prezzo unitario:
          <input
            type="number"
            name="price"
            value={input.price}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label>
          Categorie:
          <input
            type="text"
            name="category"
            value={input.category}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label>
          Carica foto:
          <input
            type="file"
            name="photos"
            onChange={handleChange}
            accept="image/png, image/jpg, image/jpeg"
            multiple
          />
        </label>
        <input type="submit" />
      </form>
    </>
  );
};
