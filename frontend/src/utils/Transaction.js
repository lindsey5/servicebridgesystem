class Transaction {
    constructor(transactionData) {
        const bookedDate = new Date(transactionData.booked_on);
        this._id = transactionData.transaction_id;
        this._provider_id = transactionData.provider;
        this._client_id = transactionData.client;
        this._service_name = transactionData.service_name;
        this._address = transactionData.address;
        this._price = parseFloat(transactionData.price);
        this._payment_method = transactionData.payment_method;
        this._status = transactionData.status;
        this._booked_on = this.#formatTimeStamp(bookedDate);
        this._time = transactionData.time;
        this._client = null;
        this._provider = null;
        this._date = null;
    }

    static async create(transactionData) {
        const transaction = new Transaction(transactionData);
        await transaction.#initializeDetails(transactionData);
        return transaction;
    }

    async #initializeDetails(transactionData) {
        try {
            this._client = await this.#getClientName(transactionData.client);
            this._provider = await this.#getProviderName(transactionData.provider);
            this._date = await this.#getDate(transactionData.date_id);
        } catch (err) {
            console.error(err);
        }
    }

    #formatTimeStamp(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12; // Convert to 12-hour format
        return `${year}-${month}-${day} (${hours}:${minutes} ${ampm})`;
    }

    #getClientName(clientID) {
        return fetch(`/api/client/name/${clientID}`)
            .then(response => response.json())
            .then(client => client.fullname)
            .catch(err => console.error(err));
    }

    #getProviderName(providerID) {
        return fetch(`/api/provider/name/${providerID}`)
            .then(response => response.json())
            .then(provider => provider.fullname)
            .catch(err => console.error(err));
    }

    #getDate(dateID) {
        return fetch(`/api/available-date/${dateID}`)
            .then(response => response.json())
            .then(date => date)
            .catch(err => console.error(err));
    }

    // Getters to access the properties
    get id() { return this._id}

    get provider_id() { return this._provider_id }

    get client_id() { return this._client_id }

    get client() { return this._client }

    get provider() { return this._provider }

    get price() { return this._price }

    get payment_method() { return this._payment_method }

    get address() { return this._address;}

    get date() { return this._date }

    get time() { return this._time }

    get booked_on() { return this._booked_on }

    get service_name() { return this._service_name }

    get status() { return this._status }
}

export default Transaction;