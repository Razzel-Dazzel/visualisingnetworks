import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

class convertClusterToJSON{

    public static void main(String[] args) throws IOException{

        int numberOfClusters = Integer.parseInt(args[0]); //Variable that specifies number of clusters used in Kmeans algorithm
        int [][] clusterConnections = new int[numberOfClusters][numberOfClusters];
        ArrayList<ArrayList<Integer>> clusterNodesBelongsTo = new ArrayList<>(1);
        for(int i=0; i < numberOfClusters; i++) {
            clusterNodesBelongsTo.add(new ArrayList<>());
        } 

        int count = 0;
        BufferedReader reader;
        // Reading in the file of the data that the kMeansClustering.exe has produced
		try {
			reader = new BufferedReader(new FileReader
            ("output.csv")); //File that stores the node clusters
            String line = reader.readLine();
            
            while (line != null) {

                String[] values = line.split(",");
                clusterNodesBelongsTo.get(Integer.parseInt(values[2])).add(count);
				// // read next line
                count++;
				line = reader.readLine();
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
        }


    //Reading the original file again to see how many nodes are in different clusters connect with one another

    try {
        reader = new BufferedReader(new FileReader
        ("network_to_share_1000.txt")); //THIS NEEDS TO BE PASSED IN
        String line = reader.readLine();
        line = reader.readLine(); // Skipping first line that says the number of nodes

        while (line != null) {
            String[] values = line.split("\t");

            //FIND THE CLUSTER THE FIRST NODE IS IN
            int clusterNodeIsIn = 0;
            int clusterOfOtherNode = 0;
            ////////////////////// The below 2 update a jagged array that shows the total number of connetions between each supernode /////////////////
            outerloop:
            for(int i=0; i < clusterNodesBelongsTo.size(); i++){
                int edgeCount = clusterNodesBelongsTo.get(i).size();
                for (int j = 0; j < edgeCount; j++) {
                    if(clusterNodesBelongsTo.get(i).get(j) == Integer.parseInt(values[0])){
                        clusterNodeIsIn = i;
                        break outerloop;
                    }
                }
            }

            outerloop:
            for(int i=0; i < clusterNodesBelongsTo.size(); i++){
                int edgeCount = clusterNodesBelongsTo.get(i).size();
                for (int j = 0; j < edgeCount; j++) {
                    if(clusterNodesBelongsTo.get(i).get(j) == Integer.parseInt(values[1])){
                        clusterOfOtherNode = i;
                        break outerloop;
                    }
                }
            }

            // Check to see that bother nodes are not in the same cluster
            // if they are not then icrementt he cound of each point by 1.
            if(clusterNodeIsIn != clusterOfOtherNode){
                clusterConnections[clusterNodeIsIn][clusterOfOtherNode]++;
                clusterConnections[clusterOfOtherNode][clusterNodeIsIn]++;
            }
            
            // read next line
            line = reader.readLine();
        }
        reader.close();
    } catch (IOException e) {
        e.printStackTrace();
    }

    // Creating a new file that converts the one supplied into a JSON file.
    String filePath = ".\\JSON200\\";
    String fileName = "200Cluster";
    File f = new File(filePath + fileName + ".JSON");

    if(!f.exists()){
        f.getParentFile().mkdirs(); 
        try {
            f.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }else{
        int i = 0;
        do{
            f = new File(filePath + fileName + "_"+ i +".JSON");
            i++;
        }while(f.exists());
        f.getParentFile().mkdirs(); 
        try {
            f.createNewFile();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    System.out.print("File created: " + f+"\n");

    // Creating file writter
    FileWriter fw = null;
    try {
        fw = new FileWriter(f, true);
    } catch (IOException ex) {

    }

    // Write the new clustered network toa  file.
    boolean writingToFile = true;
    if (fw != null) {
        while (writingToFile) { //same as while(runTrue == true)

            try {
                fw.write("{\n");
                fw.write("\"nodes\": [\n");
                for(int i=0; i < numberOfClusters; i++ ) {
                    //Object element = itr.next();
                    fw.write("\t{ \"name\": \"" +  i + "\", \"nodeInClusters\": ["+ clusterNodesBelongsTo.get(i).get(0));
                    int edgeCount = clusterNodesBelongsTo.get(i).size();
                    for (int j = 1; j < edgeCount; j++) {
                        fw.write(","+clusterNodesBelongsTo.get(i).get(j)+"");
                    }
                    fw.write((i == numberOfClusters-1) ? "]}\n" : "]},\n");
                }

                fw.write("\n],\n\"links\": [\n");
                int arbVal = 30;
                Boolean flag = false;
                for(int i=1 ; i < numberOfClusters; i++){ //9
                    for(int j=0; j<i ;j++){
                        if(clusterConnections[i][j] >= arbVal){
                            if(!flag) flag = true;
                            else fw.write(",\n");
                            fw.write("\t{ \"source\": \""+i+"\",\"target\": \""+j+"\"}");
                        }
                    }
                }

                fw.write("\n]}");

            } catch (IOException e) {
                break;
            }
            if(true){
                fw.flush();
                fw.close();
                writingToFile = false;
                break;
            }
        }
    }

    }

}