import APIError from "../errors/ApiError";

const {FeedBack} = require("../models/models");

class FeedbackService {
    async addComment(email: string, value: string, id: number) {
        if(!email || !value || !id) throw APIError.badRequest("Error with email or  or id of game");
        if(value.length > 254) throw APIError.badRequest("Too long message");
        const Feedback = await FeedBack.create({value, gameId: id, userEmail: email});
        return Feedback;
    }
    async getComments(id: number) {
        if(!id) throw APIError.badRequest("Error with id of game");
        const feedbacks = await FeedBack.findAndCountAll({where: {gameId: id}});
        return feedbacks;
    }
    async removeComment(id: number) {
        if(!id) throw APIError.badRequest("Error with id of comment");
        const feedbackremove = await FeedBack.destroy({where: {id}});
        return feedbackremove;
    }
    async editComment(id: number, value: string) {
        if(!id) throw APIError.badRequest("Error with id of comment");
        if(!value) throw APIError.badRequest("Error with value of comment");
        if(value.length > 254) throw APIError.badRequest("Too long message");
        const comment = await FeedBack.update(
            {value},
            {where: {id}}
        );
        return comment;
    }
}

export default new FeedbackService();