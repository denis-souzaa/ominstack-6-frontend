import React, { useEffect, useState } from 'react';
import { MdInsertDriveFile } from 'react-icons/md';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import api from '~/services/api';

import { Container, Header, ListFile, Upload } from './styles';

import logo from '../../assets/logo.svg';

export default function Box(props) {
	const [ state, setState ] = useState({ box: {} });
	useEffect(() => {
        
		const { id } = props.match.params;
		async function getFiles() {
			const response = await api.get(`/boxes/${id}`);
            setState({box: response.data});
            console.log(response.data)
            subscribeToNewsFiles(response.data.files);
		}

        getFiles();
    }, []);
    
    const handleUpload = (files) => {
        files.forEach(file => {
            const { id } = props.match.params;
            const data = new FormData();

            data.append('file', file);

            api.post(`boxes/${id}/files`, data);
        })
    }

    const subscribeToNewsFiles = (files) => {
        console.log('depois')
        const { id } = props.match.params;
        const io = socket('https://ominstack-backend.herokuapp.com');

        io.emit('connectRoom', id);

        io.on('file', data => {
           setState({ box: {...state.box, files: [data, ...files] } });
        });
    }

	return (
		<Container>
			<Header>
				<img src={logo} alt="logo" />
				<h1>{state.box.title}</h1>
			</Header>
            
            <Dropzone onDropAccepted={handleUpload}>
              {
                  ({getRootProps, getInputProps}) => (
                    <Upload {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p> Arraste arquivos ou clique aqui</p>
                    </Upload>  
                  )
              }
            </Dropzone>
			
            <ListFile>
				{(state.box.files || []).map((file) => (
					<li key={file._id}>
						<a href={file.url} target="_blank" rel="noopener noreferrer">
							<MdInsertDriveFile size={24} color="#A5Cfff" />
							<strong>{file.title}</strong>
						</a>
						<span>
							há{" "}
							{distanceInWords(file.createdAt, new Date(), {
								locale: pt
							})}
						</span>
					</li>
				))}
			</ListFile>
		</Container>
	);
}
