//Imports
import { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import * as formik from 'formik';
import * as yup from 'yup';
import achievementService from '../../services/crudApiService'

const AchievementForm = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [file, setFile] = useState('')
    const [achievement] = useState(location.state !== null ?
        {
            name: location.state.type.name,
            obtaining: location.state.type.obtaining,
        }
        :
        {
            name: '',
            obtaining: '',
        })


    const { Formik } = formik
    const schema = yup.object().shape({
        name: yup.string().required('*Name is required'),
        obtaining: yup.string().required('*Obtaining is required')
    })

    const handleImageChange = (e) => {
        setFile(e.target.files[0])
    }

    return (
        <>
            <div className='my-5 text-center'>
                <hr className="w-75 mx-auto"></hr>
                <h2 className='text-center'>ACHIEVEMENT FORM</h2>
                <hr className="w-75 mx-auto"></hr>
            </div>
            <Container>
                <Formik
                    initialValues={{
                        name: achievement.name,
                        obtaining: achievement.obtaining
                    }}
                    validationSchema={schema}
                    onSubmit={(values, { setSubmitting }) => {
                        setSubmitting(true)

                        const formData = new FormData()
                        formData.append('name', values.name)
                        formData.append('obtaining', values.obtaining)
                        formData.append('image', file)

                        if (location.state !== null) {
                            achievementService
                                .put(`achievements/${location.state.type.id}`, formData)
                                .catch(err => console.log(err))
                        } else {
                            achievementService
                                .post('achievements', formData)
                                .catch(err => console.log(err))
                        }

                        setSubmitting(false);
                        navigate('/admin_display', { state: { type: 'achievements' } })
                    }}
                >

                    {({ values,
                        errors,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    }) => (
                        <Form className='formStyle'>
                            <Form.Group className="mb-3">
                                <Form.Label>Name:</Form.Label>
                                <Form.Control type='text' name='name' onChange={handleChange} onBlur={handleBlur} value={values.name} isInvalid={!!errors.name} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Obtaining:</Form.Label>
                                <Form.Control as="textarea" rows={3} name='obtaining' onChange={handleChange} onBlur={handleBlur} value={values.obtaining} isInvalid={!!errors.obtaining} />
                                <Form.Control.Feedback type="invalid">
                                    {errors.obtaining}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Image:</Form.Label>
                                <Form.Control type="file" name='image' onChange={handleImageChange} />
                            </Form.Group>

                            <Button variant="primary" onClick={handleSubmit}>
                                {
                                    location.state !== null ?
                                        'UPDATE'
                                        :
                                        'ADD'
                                }
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Container >
        </>
    )
}

export default AchievementForm
