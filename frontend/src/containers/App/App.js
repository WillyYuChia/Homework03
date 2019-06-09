import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonDropdown,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

import {
  POSTS_QUERY,
  CREATE_POST_MUTATION,
  POSTS_SUBSCRIPTION
} from '../../graphql'
import Post from '../../components/Post/Post'
import classes from './App.module.css'

let unsubscribe = null

// class AuthorList extends React.Component {
//   constructor(props) {
//     super(props);

//     this.toggle = this.toggle.bind(this);
//     this.state = {
//       dropdownOpen: false
//     };
//   }

//   toggle() {
//     this.setState(prevState => ({
//       dropdownOpen: !prevState.dropdownOpen
//     }));
//   }

//   render() {
//     return (
//       <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
//         <DropdownToggle caret>
//           Who are you?
//         </DropdownToggle>
//         <DropdownMenu>
//           <DropdownItem header>Post Author</DropdownItem>
//           <DropdownItem divider />
//           <DropdownItem>Some Action</DropdownItem>
//           <DropdownItem>Foo Action</DropdownItem>
//           <DropdownItem>Bar Action</DropdownItem>
//           <DropdownItem>Quo Action</DropdownItem>
//         </DropdownMenu>
//       </Dropdown>
//     );
//   }
// }
  
class App extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.state = {
      dropdownOpen: false,
      value : '',
      text: 'Name?',
      formTitle: '',
      formBody: ''
    };
  };

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  select(event) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      value: event.target.innerText,
      text: event.target.innerText
    });
  }

  handleFormSubmit(e) {
    e.preventDefault()

    const { formTitle, formBody } = this.state

    if (this.state.value=='') {
      alert('Empty name!');
      return
    }
    if (!formTitle || !formBody) return

    var id=1;
    var target = this.state.value.toLowerCase();
    const names=['','andrew', 'sarah', 'mike'];
    for (let i=1; names[i]!=target; ++i) {
      id=i;
    }
    this.createPost({
    variables: {
      title: formTitle,
      body: formBody,
      published: true,
      authorId: id
    }
    })
    

    this.setState({
      formTitle: '',
      formBody: ''
    })
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1 className={classes.title}>Modern GraphQL Tutorial</h1>
          </Col>
        </Row>
        <Row>
          <Container className="py-4">
            <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle>{this.state.text}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.select}>Andrew</DropdownItem>
                <DropdownItem onClick={this.select}>Sarah</DropdownItem>
                <DropdownItem onClick={this.select}>Mike</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </Container>
        </Row>
        <Row>
          <Col xs="6" className={classes.form}>
            <Mutation mutation={CREATE_POST_MUTATION}>
              {createPost => {
                this.createPost = createPost

                return (
                  <Form onSubmit={this.handleFormSubmit}>
                    <FormGroup row>
                      <Label for="title" sm={2}>
                        Title
                      </Label>
                      <Col sm={10}>
                        <Input
                          name="title"
                          value={this.state.formTitle}
                          id="title"
                          placeholder="Post title..."
                          onChange={e =>
                            this.setState({ formTitle: e.target.value })
                          }
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label for="body">Body</Label>
                      <Input
                        type="textarea"
                        name="body"
                        value={this.state.formBody}
                        id="body"
                        placeholder="Post body..."
                        onChange={e =>
                          this.setState({ formBody: e.target.value })
                        }
                      />
                    </FormGroup>
                    <Button type="submit" color="primary">
                      Post!
                    </Button>
                  </Form>
                )
              }}
            </Mutation>
          </Col>
          <Col xs="6">
            <Query query={POSTS_QUERY}>
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error :(((</p>

                const posts = data.posts.map((post, id) => (
                  <Post data={post} key={id} />
                ))
                if (!unsubscribe)
                  unsubscribe = subscribeToMore({
                    document: POSTS_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev
                      const newPost = subscriptionData.data.post.data

                      return {
                        ...prev,
                        posts: [newPost, ...prev.posts]
                      }
                    }
                  })

                return <div>{posts}</div>
              }}
            </Query>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App
