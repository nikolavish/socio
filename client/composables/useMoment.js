import moment from "moment";

export default () => ({
  relativeDate(date) {
    return moment(date).fromNow();
  },
});
