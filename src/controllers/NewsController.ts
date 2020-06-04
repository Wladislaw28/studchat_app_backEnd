import express from 'express';
import socket from 'socket.io';

import { NewsModel } from '../models';

class NewsController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    index = (req: any, res: express.Response) => {
        NewsModel.find({})
            .populate(['author'])
            //@ts-ignore
            .exec(function (err, news) {
                if (err) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'News not found',
                    });
                }
                return res.json(news);
            });
    };

    create = (req: any, res: express.Response) => {

        const postData = {
            text: req.body.text,
            description: req.body.description,
            category: req.body.category,
            author: req.user._id,
        };

        const news = new NewsModel(postData);

        news.save()
            .then((obj: any) => {
                obj.populate(['author'], (err: any, news: any) => {
                    if (err) {
                        return res.status(500).json({
                            status: 'error',
                            message: err,
                        });
                    }

                    res.json(news);

                    this.io.emit('SERVER:NEW_NEWS', news);
                });
            })
            .catch(reason => {
                res.json(reason);
            });
    };

    delete = (req: any, res: express.Response) => {
        const id: string = req.query.id;
        const userId: string = req.user._id;
        
        NewsModel.findById(id, (err: any, news: any) => {
            if (err || !news) {
                return res.status(404).json({
                    status: 'error',
                    message: 'News not found',
                });
            }
            if (String(news.author) === userId) {
                news.remove();
                return res.json({
                    status: 'success',
                    message: 'News deleted',
                });
            } else {
                return res.status(403).json({
                    status: 'error',
                    message: 'Not have permission',
                });
            }
        });
    };
}

export default NewsController;