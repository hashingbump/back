import MoviesModel from '../model/movies.js'
import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: 'dsahpruxx',
    api_key: '652186324369761',
    api_secret: 'GwjubyXq017h99uVYnb9tk14YKo'
});

const postsController = {
    createNewMovie: async (req, res) => {
        try {
            const { name, time, year, introduce } = req.body;
            const file = req.file;

            if (!name || !time || !year || !introduce || !file)
                throw new Error("Du lieu dau vao co loi");


            const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const fileName = file.originalname.split('.')[0];

            const result = await cloudinary.uploader.upload(dataUrl, {
                public_id: fileName,
                resource_type: 'auto',
            });

            const image = result.secure_url;

            const movie = new MoviesModel({ name, time, year, image, introduce});
            const savedMovie = await movie.save();

            res.status(201).send({ data: savedMovie });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    },
    updateMovie: async(req, res) => {
        try {
            const { movieId } = req.params;
            const { name, time, year, introduce } = req.body;
            const file = req.file;

            if(!movieId)
                throw new Error("Chua co id cua movie tren param");

            if (!name || !time || !year || !introduce || !file)
                throw new Error("Du lieu dau vao co loi");

            const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const fileName = file.originalname.split('.')[0];
    
            const result = await cloudinary.uploader.upload(dataUrl, {
                public_id: fileName,
                resource_type: 'auto',
            });
    
            const existMovie = await MoviesModel.findById(movieId);
            if (!existMovie)
                throw new Error('Movie is not found');

            existMovie.name = name;
            existMovie.time = time;
            existMovie.year = year;
            existMovie.image = result.secure_url;
            existMovie.introduce = introduce;
            const savedMovie = await existMovie.save();
    
            res.status(200).send({ data: savedMovie });
        } catch (error) {
            res.status(403).send({ message: error.message });
        }
    },
    getMovies: async (req, res) => {
        try {
            const { type } = req.params;
            if(!type)
                throw new Error('Ban chua nhap type khi sap xep phim');

            const source_movies = await MoviesModel.find();
            let movies = source_movies;
            
            if(type === 'tang'){
                for(let i=1; i<movies.length; i++)
                    for(let j=0; j<i; j++)
                        if(movies[i].year < movies[j].year){
                            let tmp = movies[i];
                            movies[i] = movies[j];
                            movies[j] = tmp; 
                        }
            }else{
                for(let i=1; i<movies.length; i++)
                    for(let j=0; j<i; j++)
                        if(movies[i].year > movies[j].year){
                            let tmp = movies[i];
                            movies[i] = movies[j];
                            movies[j] = tmp; 
                        }
            }

            res.status(200).send({ data: movies });
        } catch (error) {
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    getMoviesOfName: async (req, res) => {
        try {
            const { keyword } = req.body;
            if(!keyword)
                throw new Error('Ban chua nhap keyword cua ten phim');

            const source_movies = await MoviesModel.find();
            let movies = [];

            for(let i=0; i<source_movies.length; i++)
                if(source_movies[i].name.includes(keyword))
                    movies.push(source_movies[i]);

            res.status(200).send({ data: movies });
        } catch (error) {
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    getAllMovies: async (req, res) => {
        try {
            let movies = await MoviesModel.find();
            
            if(!movies)
                throw new Error('Lay movies that bai');

            res.status(200).send({ data: movies });
        } catch (error) {
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    deleteMovie: async (req, res) => {
        try {
            const { movieId } = req.params;
            if(!movieId)
                throw new Error('Chua co id cua movie tren param');

            const result = await MoviesModel.deleteOne({ _id: movieId });
            
            if (result.deletedCount === 1)
                res.status(200).send({ message: "Xoa movie thanh cong" });
            else 
                res.status(404).send({ message: "Không tìm thấy bai Movie để xóa" });
        } catch (error) {
            res.status(500).send({ message: "Đã có lỗi xảy ra khi xóa bai Post" });
        }
    },
}
export default postsController;