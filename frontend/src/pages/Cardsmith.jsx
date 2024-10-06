import React, { useState } from 'react';
import LoggedInLayout from '../components/LoggedInLayout';
import CurrencyInput from '../components/CurrencyInput';
import { createCard } from '../api/api';
import { useToast } from '../contexts/ToastContext';



const Cardsmith = () => {
    const showToast = useToast();

    const [file, setFile] = useState(null);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (!files.length || !window.FileReader) {
            // no file selected, or no FileReader support
            return;
        }

        if (/^image/.test(files[0].type)) {
            const reader = new FileReader()
            reader.readAsDataURL(files[0]);

            reader.onloadend = () => {
                setImagePreview(reader.result);
            };

            setFile(files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorMap = {
            "global": []
        };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        formData.append('price', price);
        console.log(formData);

        try {

            const response = await createCard(formData);

            if (response.ok) {
                // setFile('');
                // setDescription('');
                // setPrice('');

                const data = await response.json();
                console.log(data);

                showToast('The card has been added to your collection.');
            }
            else {
                const data = await response.json();
                console.log(data);

                data.errors.forEach(error => {
                    if (!errorMap[error.param]) {
                        errorMap[error.param] = [];
                    }
                    errorMap[error.param].push(error.message);
                });
                setErrors(errorMap);
            }

        } catch (error) {
            console.log(error);

            errorMap.global.push(error.message);
        }

        const hasErrors = Object.values(errorMap).some(array => array.length > 0);
        if (hasErrors) {
            setErrors(errorMap);
        }
    };


    return (
        <LoggedInLayout title="Design your own cards!">
            <div className='row my-3'>
                <div className='col-12'>
                    <h2>Cardsmith</h2>
                </div>
            </div>
            <div className="alert alert-info" role="alert">
                <p>For best result use high quality images<br />Under 10mb file size<br />Up to 1500/2100px</p>
            </div>
            <div className="row gy-3 gy-md-4 overflow-hidden">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="col-12">
                        <label htmlFor="descriptionTextArea" className="form-label">Description <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <span className="input-group-text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-card-text" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
                                <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5" />
                            </svg></span>
                            <textarea
                                name="descriptionTextArea"
                                id="descriptionTextArea"
                                className="form-control"
                                title="Enter the description of the card."
                                aria-label="With textarea"
                                placeholder="A small, flat, rectangular piece made from paper, cardboard, or plastic, designed with specific features that convey its role in a game."
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        {errors.description && errors.description.map((msg, index) => (
                            <span key={index} className="text-danger">{msg}</span>
                        ))}
                    </div>
                    <div className="col-12">
                        <label htmlFor="priceInput" className="form-label">Price <span className="text-danger">*</span></label>
                        <CurrencyInput value={price} onChange={setPrice} />
                        {errors.price && errors.price.map((msg, index) => (
                            <span key={index} className="text-danger">{msg}</span>
                        ))}
                    </div>
                    <div className="col-12">
                        <label htmlFor="imageInput" className="form-label">Image <span className="text-danger">*</span></label>
                        <div className="input-group mb-3">
                            <input
                                name="imageInput"
                                id="imageInput"
                                type="file"
                                className="form-control"
                                title="Enter the same password you entered above."
                                required
                                onChange={handleFileChange}
                                accept='image/*'
                            />
                            <label className="input-group-text" htmlFor="file">Upload</label>
                        </div>
                        {errors.file && errors.file.map((msg, index) => (
                            <span key={index} className="text-danger">{msg}</span>
                        ))}
                    </div>
                    <div className='col-12'>
                        <div className="card mx-auto">
                            <div className="imagePreview card-img-top" style={{
                                width: '155px',  // Set width of the preview div
                                height: '217px', // Set height of the preview div
                                backgroundSize: 'cover', // Cover the div with the image
                                backgroundImage: `url(${imagePreview})`,
                                border: '1px solid #ccc', // Optional border for the preview
                            }}>

                            </div>
                            <div className="card-body">
                                <p className="card-text">Image Preview</p>
                            </div>
                        </div>
                        {!imagePreview && <p>No image uploaded</p>} {/* Fallback text */}
                    </div>
                    <div className="col-12 text-center">
                        <button className="btn btn-primary btn-lg mt-4" type="submit">Sign Up</button>
                    </div>
                    <div className="col-12">
                        {errors.global && errors.global.map((msg, index) => (
                            <span key={index} className="text-danger">{msg}</span>
                        ))}
                    </div>
                </form>
            </div>
        </LoggedInLayout>
    );
};

export default Cardsmith;