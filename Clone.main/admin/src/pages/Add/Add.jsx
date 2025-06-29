import React, { useState } from 'react'
import './Add.css'
import { assets, url } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = () => {

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Action"
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Cover image not selected');
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);

        const response = await axios.post(`${url}/api/games/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message);
            setData({
                name: "",
                description: "",
                price: "",
                category: data.category
            });
            setImage(false);
        } else {
            toast.error(response.data.message);
        }
    }

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Upload Game Cover</p>
                    <input onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} type="file" accept="image/*" id="image" hidden />
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                    </label>
                </div>
                <div className='add-product-name flex-col'>
                    <p>Game Title</p>
                    <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Enter game name' required />
                </div>
                <div className='add-product-description flex-col'>
                    <p>Game Description</p>
                    <textarea name='description' onChange={onChangeHandler} value={data.description} type="text" rows={6} placeholder='Describe the game or service...' required />
                </div>
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Category</p>
                        <select name='category' onChange={onChangeHandler}>
                            <option value="Action">Action</option>
                            <option value="Adventure">Adventure</option>
                            <option value="RPG">RPG</option>
                            <option value="Multiplayer">Multiplayer</option>
                            <option value="Indie">Indie</option>
                            <option value="Strategy">Strategy</option>
                            <option value="Simulation">Simulation</option>
                            <option value="Game Service">Game Service</option>
                        </select>
                    </div>
                    <div className='add-price flex-col'>
                        <p>Price (₹)</p>
                        <input type="Number" name='price' onChange={onChangeHandler} value={data.price} placeholder='e.g. 499' />
                    </div>
                </div>
                <button type='submit' className='add-btn'>ADD GAME</button>
            </form>
        </div>
    )
}

export default Add
