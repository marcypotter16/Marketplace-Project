import React = require('react');
import { Product } from '../classes/Product';

export const Publish = () => {
  const [input, setInput] = React.useState(new Product());
  function submit() {
    console.log(input);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  }
  return (
    <>
      <h1>Publish products</h1>
      <form onSubmit={submit}>
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
          Nome:
          <input
            type="text"
            name="name"
            value={input.name}
            onChange={(e) => handleChange(e)}
          />
        </label>
      </form>
    </>
  );
};
