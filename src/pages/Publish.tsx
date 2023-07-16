import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Product, productConverter } from "../classes/Product";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { db, storage } from "../firebase";
import { v4 } from "uuid";

export const Publish = () => {
	const params = useParams();
	const [input, setInput] = useState(new Product());
	const [quantityType, setQuantityType] = useState("pz");
	const [deleteInAWeek, setDeleteInAWeek] = useState(false);
	const photoRef = useRef(null);

	function submit(e: FormEvent<HTMLFormElement>) {
		const today = new Date();
		var productId = v4();
		e.preventDefault();
		input.publisherId = params.id!;
		input.quantityType = quantityType;
		input.deleteAfterAWeek = deleteInAWeek;
		for (const file of photoRef.current.files) {
			const imageId = file.name + v4();
			const imageRef = ref(
				storage,
				`${today.getFullYear()}/${params.id}/${productId}/${imageId}`
			);
			uploadBytes(imageRef, file);
		}
		/* db.collection('products')
      .withConverter(productConverter)
      .doc(productId)
      .set(input)
      .then((_res) => alert('Added: ' + input.name)); */
		setDoc(
			doc(db, "products", productId).withConverter(productConverter),
			input
		).then((_res) => alert("Added: " + input.name));
	}

	function handleChange(
		e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
	) {
		const { name, value } = e.target;
		if (name == "category") {
			setInput((prevInput) => ({
				...prevInput,
				category: value.split(","),
			}));
		} else {
			setInput((prevInput) => ({
				...prevInput,
				[name]: value,
			}));
		}
	}
	return (
		<div className=''>
			<form
				className='px-4 my-32 max-w-3xl mx-auto space-y-6'
				onSubmit={(e) => submit(e)}
			>
				<h1 className='text-3xl font-semibold text-white'>
					Pubblica un prodotto
				</h1>
				<div>
					<label className='text-gray-200'>Nome:</label>
					<input
						className='border border-gray-400 text-white block py-2 px-4 w-full rounded focus:outline-none focus:border-teal-500'
						type='text'
						name='name'
						value={input.name}
						onChange={(e) => handleChange(e)}
					/>
				</div>
				<div>
					<label className='text-gray-200'>Descrizione: </label>
					<textarea
						className='border border-gray-400 text-white block py-2 px-4 w-full rounded focus:outline-none focus:border-teal-500'
						name='description'
						value={input.description}
						onChange={(e) => handleChange(e)}
					/>
				</div>

				{/* QUANTITA E PREZZO */}
				<div className='grid grid-cols-2 justify-between'>
					<div className='flex flex-col w-2/3'>
						<label className='text-gray-200'>Quantità: </label>
						<div className='flex'>
							<DropdownMenu selected={quantityType} select={setQuantityType} />
							<input
								className='border border-gray-400 text-white block py-2 px-4 w-full rounded-r focus:outline-none focus:border-teal-500'
								type='number'
								min='0'
								name='quantity'
								value={input.quantity}
								step={input.quantityType == "kg" ? "0.01" : "1"}
								onChange={(e) => handleChange(e)}
							/>
						</div>
					</div>

					<div className='flex flex-col w-2/3'>
						<label className='text-gray-200'>Prezzo unitario: </label>
						<div className='flex'>
							<div className='flex items-center px-4 bg-blue-900 rounded-l'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 20 20'
									fill='currentColor'
									className='w-8 h-8 text-gray-500 bg-transparent'
								>
									<path
										fillRule='evenodd'
										d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.798 7.45c.512-.67 1.135-.95 1.702-.95s1.19.28 1.702.95a.75.75 0 001.192-.91C12.637 5.55 11.596 5 10.5 5s-2.137.55-2.894 1.54A5.205 5.205 0 006.83 8H5.75a.75.75 0 000 1.5h.77a6.333 6.333 0 000 1h-.77a.75.75 0 000 1.5h1.08c.183.528.442 1.023.776 1.46.757.99 1.798 1.54 2.894 1.54s2.137-.55 2.894-1.54a.75.75 0 00-1.192-.91c-.512.67-1.135.95-1.702.95s-1.19-.28-1.702-.95a3.505 3.505 0 01-.343-.55h1.795a.75.75 0 000-1.5H8.026a4.835 4.835 0 010-1h2.224a.75.75 0 000-1.5H8.455c.098-.195.212-.38.343-.55z'
										clipRule='evenodd'
									/>
								</svg>
							</div>
							<input
								className='border border-gray-400 block py-2 px-4 w-full rounded-r text-white focus:outline-none focus:border-teal-500'
								type='number'
								name='price'
								step={0.01}
								min='0'
								value={input.price}
								onChange={(e) => handleChange(e)}
							/>
						</div>
					</div>
				</div>

				{/* CATEGORIE */}
				<div>
					<label className='text-gray-200'>Categorie: </label>
					<input
						className='border border-gray-400 text-white block py-2 px-4 w-full rounded focus:outline-none focus:border-teal-500'
						type='text'
						name='category'
						value={input.category}
						onChange={(e) => handleChange(e)}
					/>
					<label className='text-gray-600 text-sm'>
						Separare le categorie con virgole, ad esempio: cibo,ortaggi,...
					</label>
				</div>

				{/* FOTO */}
				<div>
					<label
						className='block text-sm font-medium text-gray-400 dark:text-white'
						htmlFor='file_input'
					>
						Carica foto:
					</label>
					<input
						className='block w-full text-sm border border-gray-300 rounded-lg file:mx cursor-pointer text-gray-600 focus:outline-none p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
						id='file_input'
						type='file'
						name='photos'
						accept='image/png, image/jpg, image/jpeg'
						multiple
						ref={photoRef}
					/>
				</div>
				<div className='flex flex-col-reverse max-w-3xl justify-center'>
					<div className='flex justify-center py-2 items-center space-x-2'>
						<input
							type='checkbox'
							id='delete-1-week'
							onChange={(e) => {
								setDeleteInAWeek(e.target.checked);
								console.log(deleteInAWeek, e.target.checked);
							}}
							className='hidden'
							value={deleteInAWeek ? "on" : "off"}
						></input>
						<label
							htmlFor='delete-1-week'
							className='flex items-center cursor-pointer'
						>
							{deleteInAWeek ? (
								<CheckCircleIcon className='w-8 h-8 text-green-500' />
							) : (
								<XCircleIcon className='w-8 h-8 text-red-500' />
							)}

							<span className='ml-3 text-gray-400 text-xs'>
								Elimina dopo una settimana, utile in caso di prodotti alimentari
								non conservabili
							</span>
						</label>
					</div>
					<button
						type='submit'
						className='border border-gray-200 text-white rounded py-2 px-5 hover:shadow-lg hover:shadow-cyan-500/50 hover:border-teal-500'
					>
						Inserisci Prodotto
					</button>
				</div>
			</form>
		</div>
	);
};

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

function DropdownMenu({ selected, select }) {
	return (
		<Menu as='div' className='flex items-center inline-block text-left'>
			<div className='flex items-center'>
				<Menu.Button className='flex h-full justify-center rounded-l bg-blue-900 px-3 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-50'>
					{selected}
					<ChevronDownIcon
						className='-mr-1 ml-1 h-5 w-5 text-gray-400 bg-transparent'
						aria-hidden='true'
					/>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter='transition ease-out duration-100'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-100'
				leaveTo='transform opacity-0 scale-95'
			>
				<Menu.Items className='absolute ml-12 origin-top-left rounded-md border bg-black focus:outline-none'>
					<div className='bg-transparent'>
						{["kg", "g", "l", "ml", "pz"].map((unit) => (
							<Menu.Item key={unit}>
								{({ active }) => (
									<a
										onClick={() => {
											console.log("Pz");
											select("pz");
										}}
										className={classNames(
											active ? "bg-teal-400 text-gray-900" : "text-gray-100",
											"block px-4 text-xs cursor-pointer"
										)}
									>
										{unit}
									</a>
								)}
							</Menu.Item>
						))}
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
}
