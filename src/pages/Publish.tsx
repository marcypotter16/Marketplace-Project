import React = require('react');
import { Product } from '../classes/Product';

export const Publish = () => {
  const [input, setInput] = React.useState(new Product());
  function submit(e) {
    e.preventDefault();
    console.log(input);
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
        <input type="submit" />
      </form>
    </>
  );
};
