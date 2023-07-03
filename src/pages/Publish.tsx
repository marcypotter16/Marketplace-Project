import React = require('react');
import { useParams } from 'react-router-dom';
import { Product, productConverter } from '../classes/Product';
import { db } from '../firebase';

export const Publish = () => {
  const params = useParams();
  const [input, setInput] = React.useState(new Product());
  function submit(e) {
    e.preventDefault();
    console.log(input);
    input.publisherId = params.id;
    db.collection('products')
      .withConverter(productConverter)
      .add(input)
      .then((res) => alert('Added: ' + input.name));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name == 'category') {
      setInput((prevInput) => ({
        ...prevInput,
        category: value.split(','),
      }));
    } else if (name == 'photos') {
      let photoURLs = input.photoURLs;
      photoURLs.push(':)');
      setInput((prevInput) => ({
        ...prevInput,
        photoURLs: photoURLs,
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
        <label htmlFor="">
          Carica foto:
          <input type="file" name="" />
        </label>
        <input type="submit" />
      </form>
    </>
  );
};
