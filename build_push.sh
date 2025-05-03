aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 653165975858.dkr.ecr.ap-south-1.amazonaws.com
docker build --platform linux/amd64 -t maverick .
docker tag maverick:latest 653165975858.dkr.ecr.ap-south-1.amazonaws.com/maverick:latest
docker push 653165975858.dkr.ecr.ap-south-1.amazonaws.com/maverick:latest