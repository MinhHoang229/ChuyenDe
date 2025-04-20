import React from 'react'

const NewsletterBox = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault()
        const email = event.target.email.value
        console.log('Subscribed email:', email)
        // Here you can add your logic to handle the subscription
        event.target.email.value = '' // Clear the input after submission
    }

    return (
        <div className='text-center py-16 bg-gray-30'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 10% off</p>
            <p className='text-gray-400 mt-3 mb-8'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
            <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto px-4'>
                <input 
                    name="email"
                    className='w-full px-4 py-3 outline-none border border-gray-300 rounded' 
                    type='email' 
                    placeholder='Enter your email'
                    required
                />
                <button 
                    type='submit' 
                    className='bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors'
                >
                    Subscribe
                </button>
            </form>
        </div>
    )
}

export default NewsletterBox