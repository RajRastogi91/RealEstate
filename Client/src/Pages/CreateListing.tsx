import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { jwtDecode } from 'jwt-decode';

const CreateListing: React.FC = () => {

    const currentUser = useSelector((state : any) => state.user.currentUser);
    const userid = currentUser?.access_token;
    const decoded:any=jwtDecode(userid);
    const id=decoded.id;
    const userType = decoded.usertype;
    console.log(userType)

    if (userType === 'Buyer') {
        return <div>Access denied. Only sellers can create listings.</div>;
      }
    

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [propertyDetails, setPropertyDetails] = useState({
        title: '',
        description: '',
        location: '',
        sell: false,
        rent: false,
        parking: false,
        furnished: false,
        bedroom: 1,
        bathroom: 1,
        price: '',
        userid:id,
    });   

    
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

   
  

//********************************************** */
    const storeImage = async (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const storage = getStorage();
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },   
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {     
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            );
        });
    };


    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const selectedFiles = Array.from(files).slice(0, 6); // Select up to 6 files
            setSelectedImages(selectedFiles);
        }
    };

    const handleDeleteImage = (index: number) => {
        const updatedImages = [...selectedImages];
        updatedImages.splice(index, 1);
        setSelectedImages(updatedImages);
    };

    //******************************** */

    const handleUpload = async () => {
        if (selectedImages.length === 0) {
            alert('You should select at least one image');
            return;
        }
        setLoading(true);
        try {

            const promises = selectedImages.map((image) => storeImage(image));
            const imageUrls = await Promise.all(promises);
        //     console.log('Images uploaded:', imageUrls);
        // } catch (error) {   
        //     console.error('Error uploading images:', error);
        // }
        const propertyData = {
            ...propertyDetails,      
            images: imageUrls,
        };     

        // Send property data to the server
       const response = await fetch('https://newrealestate.onrender.com/listing/createlist', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                "Authorization":`Bearer ${userid}`
            },
            body: JSON.stringify(propertyData),
        });

        if (!response.ok) {
            throw new Error('Failed to create property');
        }
    

        setSuccessMessage('Property created successfully!');
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000); // Hide the message after 3 seconds

        console.log('Property created successfully with image URLs:', propertyData);
        // console.log(responseData);
        // console.log('Property ID:', propertyid);
    } catch (error) {
        console.error('Error creating property:', error);
    } finally {
        setLoading(false);
    }
    };


   
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let newValue: string | boolean = value;
        if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        }

        setPropertyDetails((prevDetails) => ({
            
            ...prevDetails,
            [name]: newValue,
        }));
    };
   

  return (
   <main className='p-3 max-w-4xl mx-auto'>
     {successMessage && (
            <div className="bg-green-200 text-green-800 p-3 rounded-md mb-3">
                {successMessage}
            </div>
        )}
    <h1 className='text-3xl font-semibold text-center my-7'> Create a Property List</h1>
    <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
            <input       
            type="text"
            placeholder='Title' 
            className='border p-3 rounded-lg' 
            id='title' 
            maxLength={65} 
            minLength={10} 
            required  
            value={propertyDetails.title}
            onChange={handleChange}
            name="title"/>

            <textarea 
            placeholder='Description' 
            className='border p-3 rounded-lg' 
            id='description' 
            required
            value={propertyDetails.description}
            onChange={handleChange}
            name="description" />

            <input 
            type="text" 
            placeholder='Location' 
            className='border p-3 rounded-lg' 
            id='location' 
            required
            value={propertyDetails.location}
            onChange={handleChange}
            name="location" />

            <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>   
                    <input 
                    type="checkbox" 
                    id="Sell" 
                    className='w-5'
                    value={propertyDetails.sell ? 'true' : 'false'}
                    onChange={handleChange}
                    name="sell" />   
                    <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                    <input 
                    type="checkbox" 
                    id="Rent" 
                    className='w-5'
                    value={propertyDetails.rent ? 'true' : 'false'}
                    onChange={handleChange}
                    name="rent" />
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input 
                    type="checkbox" 
                    id="Parking" 
                    className='w-5'
                    value={propertyDetails.parking ? 'true' : 'false'}
                    onChange={handleChange}
                    name="parking" />
                    <span>Parking</span>
                </div>
                <div className='flex gap-2'>
                    <input 
                    type="checkbox" 
                    id="Furnished" 
                    className='w-5'
                    value={propertyDetails.furnished ? 'true' : 'false'}
                    onChange={handleChange}
                    name="furnished" />
                    <span>Furnished</span>
                </div>
            </div>
            <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-2'>
                    <input 
                    type="number" 
                    id='bedroom' 
                    min={1} 
                    max={10} 
                    required 
                    className='p-3 border border-gray-300 rounded-lg'
                    value={propertyDetails.bedroom}
                    onChange={handleChange}
                    name="bedroom"/>
                    <span>Bedroom</span>
                </div>
                <div className='flex items-center gap-2'>
                    <input 
                    type="number" 
                    id='bathroom' 
                    min={1} max={10}
                    required 
                    className='p-3 border border-gray-300 rounded-lg'
                    value={propertyDetails.bathroom}
                    onChange={handleChange}
                    name="bathroom"/>
                    <span>Bathroom</span>
                </div>
                <div className='flex items-center gap-2'>
                    <input 
                    type="text" 
                    placeholder="Price" 
                    className="p-3 border border-gray-300 rounded-lg" 
                    id="price" 
                    pattern="^\d+(\.\d{1,2})?$" 
                    required 
                    value={propertyDetails.price}
                    onChange={handleChange}
                    name="price"/> 
                    <span>Price</span>
                </div>
            </div>

                

        </div>
            <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>
                Images:
                <span className='font-normal text-gray-600 ml-2'>
                The first image will be the cover (max 6)
                </span>
            </p>
            <div className='flex gap-4'>
                <input 
                 onChange={handleImageChange}
                className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                {/* <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' >Upload</button> */}
            </div> 

            <div className="flex gap-4 flex-wrap">
                        {selectedImages.map((image, index) => (
                            <div key={index} className="relative">    
                                <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                                <button className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center" onClick={() => handleDeleteImage(index)}>X</button>
                            </div>
                        ))}
                    </div>

            <button

              type='button'    
              className='p-3 bg-blue-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
              onClick={handleUpload}
              disabled={loading} >
                {loading ? 'Creating...' : 'Create Listing'}    
            </button>
        </div>
    </form>
   </main>
  )
}

export default CreateListing;

