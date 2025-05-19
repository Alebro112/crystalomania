export type MakeDepositFormProps = {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export type MakeDepositFormLoadingState = {
    teams: boolean,
    currencies: boolean
}